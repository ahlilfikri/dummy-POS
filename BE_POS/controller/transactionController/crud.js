
const e = require('cors');
const transactionSchemaModel = require('../../model/transactionModel');
const { errorLogs } = require('../../utils/logging');
const moment = require('moment');
const materialSchemaModel = require('../../model/materialModel');

exports.createtransactionSchema = async (req, res) => {
    try {
        const { barang, jumlah, total } = req.body;
        const transactionSchema = new transactionSchemaModel({ barang, jumlah, total });
        await transactionSchema.save();
        res.status(201).json(transactionSchema);
    } catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

exports.getAlltransactionSchema = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const statusFilter = req.query.status || ''; // Menambahkan status filter
        const skip = (page - 1) * limit;

        // Buat query filter untuk status jika ada
        const query = statusFilter ? { status: statusFilter } : {}; // Jika status ada, filter berdasarkan status

        // Ambil transaksi dengan pagination dan filter status
        const transactionSchema = await transactionSchemaModel.find(query)
            .skip(skip)
            .limit(limit)
            .populate('cashierId', 'nama')
            .exec();

        const totalTransactions = await transactionSchemaModel.countDocuments(query); // Hitung total transaksi dengan filter status

        if (transactionSchema.length === 0) {
            return res.status(404).json({ message: 'No transactions found' });
        }

        res.status(200).json({
            transactions: transactionSchema,
            totalTransactions: totalTransactions,
            totalPages: Math.ceil(totalTransactions / limit),
            currentPage: page,
        });
    } catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

// Fungsi untuk mengambil data total penjualan per hari dalam rentang waktu tertentu
exports.getSalesInRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "startDate dan endDate harus diisi" });
        }

        // Pastikan startDate dari jam 00:00 WIB dan endDate sampai jam 23:59 WIB
        const start = moment.utc(startDate).startOf('day').subtract(7, 'hours').toDate();
        const end = moment.utc(endDate).endOf('day').subtract(7, 'hours').toDate();

        // Query transaksi sukses dalam rentang tanggal (disesuaikan ke WIB)
        const salesData = await transactionSchemaModel.aggregate([
            {
                $match: {
                    status: 'success',
                    createdAt: { $gte: start, $lte: end }
                }
            },
            {
                $addFields: {
                    createdAtWIB: { $dateAdd: { startDate: "$createdAt", unit: "hour", amount: 7 } }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%d-%m-%Y", date: "$createdAtWIB" } },
                    totalAmount: { $sum: "$total" },
                    itemDetails: { $push: "$item" },
                }
            },
            { $sort: { _id: 1 } },
        ]);

        // Hitung total transaksi untuk rentang waktu
        const totalAmount = salesData.reduce((acc, data) => acc + data.totalAmount, 0);

        // Statistik material yang paling banyak dibeli
        const itemsStatistic = await transactionSchemaModel.aggregate([
            {
                $match: {
                    status: 'success',
                    createdAt: { $gte: start, $lte: end }
                }
            },
            { $unwind: "$item" },
            {
                $group: {
                    _id: "$item.nama",
                    totalQuantity: { $sum: "$item.jumlah" },
                    totalCost: { $sum: { $multiply: ["$item.jumlah", "$item.hargaJual"] } },
                }
            },
            { $sort: { totalQuantity: -1 } },
        ]);

        const materialData = await materialSchemaModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end }
                }
            },
            {
                $addFields: {
                    createdAtWIB: { $dateAdd: { startDate: "$createdAt", unit: "hour", amount: 7 } }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%d-%m-%Y", date: "$createdAtWIB" } },
                    totalAmount: { $sum: "$hargaBeli" },
                    itemDetails: {
                        $push: {
                            name: "$name",
                            jumlah: { $ifNull: ["$stock", 0] } // Kalau stock null, set ke 0
                        }
                    }
                }
            },
            { $sort: { _id: 1 } },
        ]);        

        const totalAmountMaterial = materialData.reduce((acc, data) => acc + data.totalAmount, 0);

        const materialStatistic = await materialSchemaModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: "$name",
                    totalQuantity: { $sum: "$stock" }, // Total jumlah bahan baku yang dibeli
                    totalCost: { $sum: { $multiply: ["$stock", "$hargaBeli"] } } // Total harga beli bahan baku
                }
            },
            { $sort: { totalCost: -1 } } // Urutin berdasarkan total harga beli tertinggi
        ]);
        

        if (salesData.length === 0) {
            return res.status(404).json({ message: 'No sales data available for the selected period' });
        }

        res.status(200).json({
            salesData,
            totalAmount,
            currentPage: page,
            itemsStatistic,
            materialData,
            totalAmountMaterial,
            materialStatistic
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};


exports.getAlltransactionSchemaByToday = async (req, res) => {
    try {
        // Ambil parameter halaman dan limit dari query string
        const page = parseInt(req.query.page) || 1; // Default page = 1
        const limit = parseInt(req.query.limit) || 10; // Default limit = 10

        // Hitung offset berdasarkan page dan limit
        const skip = (page - 1) * limit;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Ambil data dengan pagination (skip dan limit)
        const transactionSchema = await transactionSchemaModel.find({ createdAt: { $gte: today, $lt: tomorrow } })
            .skip(skip)
            .limit(limit)
            .populate('cashierId', 'nama')
            .exec();

        console.log(transactionSchema);

        // Hitung total transaksi untuk pagination
        const totalTransactions = await transactionSchemaModel.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } });

        // Jika tidak ada data, kirimkan status 404
        if (transactionSchema.length === 0) {
            return res.status(404).json({ message: 'No transaction today' });
        }

        // Kirimkan data beserta informasi pagination
        res.status(200).json({
            transactions: transactionSchema,
            totalTransactions: totalTransactions,
            totalPages: Math.ceil(totalTransactions / limit), // Menghitung jumlah total halaman
            currentPage: page,
        });
    } catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};


exports.gettransactionSchemaById = async (req, res) => {
    try {
        const { id } = req.params;
        const transactionSchema = await transactionSchemaModel.findById(id);
        res.status(200).json(transactionSchema);
    } catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

exports.updatetransactionSchema = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Menerima status yang akan diperbarui

        // Cari transaksi berdasarkan ID
        const transaction = await transactionSchemaModel.findById(id);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Proses untuk mengubah status transaksi berdasarkan status yang diterima
        if (status === 'approve') {
            if (transaction.status === 'delete') {
                // Jika status adalah 'delete', ubah menjadi 'failed'
                transaction.status = 'failed';
            } else if (transaction.status === 'edit') {
                // Untuk status 'edit', beri alert bahwa perubahan tidak dilakukan
                return res.status(200).json({ message: 'Edit request acknowledged, no changes made' });
            }
        } else if (status === 'reject') {
            // Jika status ditolak, kembalikan menjadi 'success'
            transaction.status = 'success';
        } else {
            transaction.status = status;
        }

        // Perbarui transaksi di database
        const updatedTransaction = await transaction.save();

        res.status(200).json(updatedTransaction);
    } catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

exports.deletetransactionSchema = async (req, res) => {
    try {
        const { id } = req.params;
        await transactionSchemaModel.findByIdAndDelete(id);
        res.status(204).json();
    }
    catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};
