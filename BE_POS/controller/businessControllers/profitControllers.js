const Transaction = require('../../model/transactionModel');
const Item = require('../../model/itemModel');
const Oprasional = require('../../model/oprasionalModels');
const FixedOprasional = require('../../model/fixedOprasionalModels');

exports.calculateProfitLoss = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Tanggal mulai dan akhir harus diberikan." });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        const transactions = await Transaction.find({
            status: "success",
            createdAt: { $gte: start, $lte: end }
        });

        let totalRevenue = 0;
        let totalCostOfGoodsSold = 0;

        for (const transaction of transactions) {
            for (const item of transaction.item) {
                totalRevenue += item.subtotal;

                // Cari harga beli dari database Item
                const itemData = await Item.findById(item.itemId);
                if (itemData) {
                    totalCostOfGoodsSold += itemData.hargaBeli * item.jumlah;
                }
            }
        }

        const fixedOperationalCosts = await FixedOprasional.aggregate([
            {
                $match: {
                    tanggalOprational: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: null,
                    totalFixedOprational: { $sum: "$biayaOprational" }
                }
            }
        ]);

        const totalFixedOperationalCosts = fixedOperationalCosts.length > 0 ? fixedOperationalCosts[0].totalFixedOprational : 0;

        const variableOperationalCosts = await Oprasional.aggregate([
            {
                $match: {
                    approvalStatus: "approved",
                    createdAt: { $gte: start, $lte: end }
                }
            },
            {
                $group: {
                    _id: null,
                    totalVariableOprational: { $sum: "$biayaOprational" }
                }
            }
        ]);

        const totalVariableOperationalCosts = variableOperationalCosts.length > 0 ? variableOperationalCosts[0].totalVariableOprational : 0;

        // 4. Hitung Laba Kotor
        const grossProfit = totalRevenue - totalCostOfGoodsSold;

        // 5. Hitung Laba Bersih 
        const totalOperationalCosts = totalFixedOperationalCosts + totalVariableOperationalCosts;
        const netProfit = grossProfit - totalOperationalCosts;

        res.status(200).json({
            revenue: totalRevenue, // ini total pendapatan
            costOfGoodsSold: totalCostOfGoodsSold, // ini total harga beli
            grossProfit, // ini laba kotor
            fixedOperationalCosts: totalFixedOperationalCosts, // ini total biaya operasional tetap
            variableOperationalCosts: totalVariableOperationalCosts, // ini total biaya operasional variabel
            totalOperationalCosts, // ini total biaya operasional
            netProfit, // ini laba bersih
            startDate, // ini tanggal mulai
            endDate // ini tanggal akhir
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan server." });
    }
};
