const ItemModel = require('../../model/itemModel');
const MaterialModel = require('../../model/materialModel');
const CashierModel = require("../../model/userPosModel");
const TransactionModel = require("../../model/transactionModel");
const fs = require('fs');
const path = require('path');
const { generateQRCodeFile } = require('../../utils/qrgenerator');
const { errorLogs } = require('../../utils/logging');
const { reduceMaterials } = require('../../config/reduceMaterial');

const MATERIAL_CONFIG_PATH = path.join(__dirname, '../../setting/material.json');

const unitConversion = {
    kg: 1000,
    liter: 1000,
    gram: 1,
    ml: 1
};


const createTransactionReduce = async (req, res) => {
    try {

        let { cashierId, item, detail, metodePembayaran, uangMasuk } = req.body;

        if (typeof item === "string") {
            item = JSON.parse(item);
        }


        if (!Array.isArray(item) || item.length === 0) {
            return res.status(400).json({ message: "Item tidak boleh kosong" });
        }

        const cashierExists = await CashierModel.findById(cashierId);
        if (!cashierExists) {
            return res.status(404).json({ message: "Cashier tidak ditemukan" });
        }

        let total = 0;
        const itemsWithSubtotal = [];
        const materialStockUpdates = {};

        const itemIds = item.map(i => i.itemId);
        const foundItems = await ItemModel.find({ _id: { $in: itemIds } }).populate({
            path: "materials.materialId",
            select: "_id"
        });

        for (const i of item) {
            const foundItem = foundItems.find(f => f._id.toString() === i.itemId);
            if (!foundItem) {
                return res.status(404).json({ message: `Item dengan ID ${i.itemId} tidak ditemukan` });
            }

            const subtotal = foundItem.hargaJual * i.jumlah;

            if (foundItem.stok < i.jumlah) {
                return res.status(400).json({ message: `Stok tidak cukup untuk item ${foundItem.nama}` });
            }

            if (!foundItem.isNonMaterial) {
                for (const mat of foundItem.materials) {
                    const materialExists = await MaterialModel.findById(mat.materialId._id || mat.materialId);
                    if (materialExists) {
                        const itemUnit = mat.unitPerMaterial.toLowerCase();
                        const materialUnit = materialExists.unit.toLowerCase();

                        let totalReduction = mat.quantityPerMaterial * i.jumlah;

                        if (unitConversion[materialUnit] && unitConversion[itemUnit]) {
                            if (unitConversion[materialUnit] > unitConversion[itemUnit]) {
                                totalReduction /= unitConversion[materialUnit] / unitConversion[itemUnit];
                            } else if (unitConversion[materialUnit] < unitConversion[itemUnit]) {
                                totalReduction *= unitConversion[itemUnit] / unitConversion[materialUnit];
                            }
                        } else {
                            return res.status(400).json({ message: `Unit ${itemUnit} tidak bisa dikonversi ke ${materialUnit}` });
                        }

                        if (materialExists.stock < totalReduction) {
                            return res.status(400).json({
                                message: `Stok material ${materialExists.name} tidak cukup untuk item ${foundItem.nama}`,
                            });
                        }

                        if (!materialStockUpdates[materialExists._id]) {
                            materialStockUpdates[materialExists._id] = 0;
                        }
                        materialStockUpdates[materialExists._id] += totalReduction;
                    }
                }
            }

            itemsWithSubtotal.push({
                itemId: i.itemId,
                nama: foundItem.nama,
                namaItem: foundItem.nama,
                hargaJual: foundItem.hargaJual,
                jumlah: i.jumlah,
                subtotal: subtotal,
            });

            total += subtotal;
        }

        for (const i of itemsWithSubtotal) {
            await ItemModel.findByIdAndUpdate(i.itemId, { $inc: { stok: -i.jumlah } });
        }

        for (const materialId in materialStockUpdates) {
            await MaterialModel.findByIdAndUpdate(materialId, {
                $inc: { stock: -materialStockUpdates[materialId] }
            });
        }

        let uangKembalian = 0;
        if (uangMasuk > total) {
            uangKembalian = uangMasuk - total;
        }

        const newTransaction = new TransactionModel({
            cashierId,
            metodePembayaran,
            item: itemsWithSubtotal,
            detail,
            total,
            status: "success",
            uangMasuk,
            uangKembalian: uangKembalian,
        });

        await newTransaction.save();
        const qrPath = await generateQRCodeFile(newTransaction.detail, newTransaction._id);
        if (qrPath) {
            newTransaction.qrCode = qrPath;
            await newTransaction.save();
        }

        res.status(201).json({ message: "Transaksi berhasil dibuat", transaction: newTransaction });
    } catch (error) {
        errorLogs(error.message, req, res);
        console.error("🔥 ERROR:", error);
        res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};


const createTransactionNonReduce = async (req, res) => {
    try {

        let { cashierId, item, detail, metodePembayaran } = req.body;

        if (typeof item === "string") {
            item = JSON.parse(item);
        }


        if (!Array.isArray(item) || item.length === 0) {
            return res.status(400).json({ message: "Item tidak boleh kosong" });
        }

        const cashierExists = await CashierModel.findById(cashierId);
        if (!cashierExists) {
            return res.status(404).json({ message: "Cashier tidak ditemukan" });
        }

        let total = 0;
        const itemsWithSubtotal = [];

        const itemIds = item.map(i => i.itemId);
        const foundItems = await ItemModel.find({ _id: { $in: itemIds } });

        for (const i of item) {
            const foundItem = foundItems.find(f => f._id.toString() === i.itemId);
            console.log("nilai i ---- ", i);
            console.log("nilai foundItem ---- ", foundItem);

            if (!foundItem) {
                return res.status(404).json({ message: `Item dengan ID ${i.itemId} tidak ditemukan` });
            }

            const subtotal = foundItem.hargaJual * i.jumlah;

            if (foundItem.stok < i.jumlah) {
                return res.status(400).json({ message: `Stok tidak cukup untuk item ${foundItem.nama}` });
            }

            itemsWithSubtotal.push({
                itemId: i.itemId,
                nama: foundItem.nama,
                namaItem: foundItem.nama,
                hargaJual: foundItem.hargaJual,
                jumlah: i.jumlah,
                subtotal: subtotal,
            });

            total += subtotal;
        }


        for (const i of itemsWithSubtotal) {
            await ItemModel.findByIdAndUpdate(i.itemId, {
                $inc: { stok: -i.jumlah }
            });
        }

        const newTransaction = new TransactionModel({
            cashierId,
            metodePembayaran,
            item: itemsWithSubtotal,
            detail,
            total,
            status: "success",
        });

        await newTransaction.save();
        const qrPath = await generateQRCodeFile(newTransaction.detail, newTransaction._id);
        if (qrPath) {
            newTransaction.qrCode = qrPath;
            await newTransaction.save();
        }

        res.status(201).json({ message: "Transaksi berhasil dibuat", transaction: newTransaction });

    } catch (error) {
        errorLogs(error.message, req, res);
        console.error("🔥 ERROR:", error);
        res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};

exports.createTransaction = async (req, res) => {
    const materialConfig = JSON.parse(fs.readFileSync(MATERIAL_CONFIG_PATH, 'utf-8'));

    return materialConfig.autoReduction
        ? createTransactionReduce(req, res)
        : createTransactionNonReduce(req, res);
};

exports.redusStockMaterial = async (req, res) => {
    try {
        const { decision } = req.body;

        if (typeof decision !== 'boolean') {
            return res.status(400).json({ message: 'Decision harus bertipe boolean' });
        }

        const material = await reduceMaterials(decision);

        res.status(200).json({ message: 'Berhasil mengubah status reduksi material', material });
    } catch (error) {
        errorLogs(error.message, req, res);
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};
