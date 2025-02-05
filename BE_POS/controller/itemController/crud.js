const mongoose = require('mongoose');
const ItemModel = require('../../model/itemModel');
const MaterialModel = require('../../model/materialModel');
const CategoryModel = require('../../model/categoryModels');
const fs = require('fs');
const path = require('path');
const { errorLogs } = require('../../utils/logging');

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


// data category bawaan jika tidak ada category yang dipilih
/*
{
  "_id": {
    "$oid": "679b37288915ea590f3b99da"
  },
  "name": "other",
  "description": "untuk item yang tidak termasuk atau tidak terdapat category nya",
  "createdAt": {
    "$date": "2025-01-30T08:24:08.413Z"
  },
  "updatedAt": {
    "$date": "2025-01-30T08:24:08.413Z"
  },
  "__v": 0
}

*/

exports.createItem = async (req, res) => {
    try {
        const { nama, hargaBeli, hargaJual, stok, isNonMaterial, categoryId } = req.body;
        let materials = req.body.materials ? JSON.parse(req.body.materials) : [];

        console.log("🔹 REQ.BODY:", req.body);

        let imagePath = req.file ? `/uploads/item/${req.file.filename}` : null;

        let categoryIds = Array.isArray(categoryId) ? categoryId : JSON.parse(categoryId);

        let foundCategories = await CategoryModel.find({ _id: { $in: categoryIds } });

        if (foundCategories.length !== categoryIds.length) {
            return res.status(400).json({ message: "Beberapa kategori tidak ditemukan" });
        }

        if (foundCategories.length === 0) {
            let defaultCategory = await CategoryModel.findOne({ name: 'other' });
            if (!defaultCategory) {
                return res.status(500).json({ message: 'Kategori default "other" tidak ditemukan' });
            }
            foundCategories = [defaultCategory];
        }

        const isNonMaterialBoolean = isNonMaterial === "true" || isNonMaterial === true;

        if (isNonMaterialBoolean) {
            const newItem = new ItemModel({
                nama,
                hargaBeli,
                hargaJual,
                stok,
                categoryId: foundCategories.map(cat => cat._id),
                image: imagePath,
                isNonMaterial: true,
                materials: [],
            });

            await newItem.save();
            return res.status(201).json({ message: 'Item berhasil dibuat (tanpa bahan baku)', item: newItem });
        }

        if (!materials || materials.length === 0) {
            return res.status(400).json({ message: 'Materials tidak boleh kosong jika item ini membutuhkan bahan baku' });
        }

        const validatedMaterials = await validateMaterials(materials);

        const newItem = new ItemModel({
            nama,
            hargaBeli,
            hargaJual,
            stok,
            categoryId: foundCategories.map(cat => cat._id),
            image: imagePath,
            isNonMaterial: false,
            materials: validatedMaterials,
        });

        await newItem.save();
        res.status(201).json({ message: 'Item berhasil dibuat (dengan bahan baku)', item: newItem });

    } catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

exports.getAllItem = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const search = req.query.search || '';
        const category = req.query.category || '';

        const query = {
            nama: { $regex: search, $options: 'i' } 
        };

        if (category) {
            query['categoryId'] = { $in: [new mongoose.Types.ObjectId(category)] };
        }

        const totalCount = await ItemModel.countDocuments({
            nama: { $regex: search, $options: 'i' }
        });

        const totalPages = Math.ceil(totalCount / limit);



        const items = await ItemModel.find()
            .populate('materials.materialId', 'name unit stock')
            .populate('categoryId', 'name')
            .sort({ nama: 1 })
            .skip(skip)
            .limit(limit);

        if (items.length === 0) {
            return res.status(404).json({ message: 'Item belum ada' });
        }

        res.status(200).json({
            items,
            totalCount,
            totalPages,
            currentPage: page,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

exports.getAllItemCashier = async (req, res) => {
    try {
        const search = req.query.search || '';
        const category = req.query.category || '';

        const query = {
            nama: { $regex: search, $options: 'i' } 
        };

        if (category) {
            query['categoryId'] = { $in: [new mongoose.Types.ObjectId(category)] };
        }

        const totalCount = await ItemModel.countDocuments({
            nama: { $regex: search, $options: 'i' }
        });

        const items = await ItemModel.find()
            .populate('materials.materialId', 'name unit stock')
            .populate('categoryId', 'name')
            .sort({ nama: 1 });

        if (items.length === 0) {
            return res.status(404).json({ message: 'Item belum ada' });
        }

        res.status(200).json({
            items
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};


exports.getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!validateObjectId(id)) {
            return res.status(400).json({ message: 'ID tidak valid' });
        }

        const item = await ItemModel.findById(id).populate('materials.materialId', 'name unit stock');

        if (!item) {
            return res.status(404).json({ message: 'Item tidak ditemukan' });
        }

        res.status(200).json(item);
    } catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};



exports.updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ message: 'ID tidak valid' });

        const { nama, hargaBeli, hargaJual, stok, isNonMaterial = false, categoryId } = req.body;

        let materials = req.body.materials ? JSON.parse(req.body.materials) : [];



        const item = await ItemModel.findById(id);
        if (!item) return res.status(404).json({ message: 'Item tidak ditemukan' });

        // 🔹 Handle Update Gambar (hapus yang lama jika ada gambar baru)
        let imagePath = item.image;
        if (req.file) {
            if (item.image) {
                const oldImagePath = path.join(__dirname, '../../', item.image);
                if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
            }
            imagePath = `/uploads/item/${req.file.filename}`;
        }

        // 🔹 Validasi Kategori (Gunakan kategori yang dikirim atau default "other")
        let categoryIds = Array.isArray(categoryId) ? categoryId : [categoryId];
        const foundCategories = await CategoryModel.find({ _id: { $in: categoryIds } });

        if (foundCategories.length !== categoryIds.length) {
            return res.status(400).json({ message: "Beberapa kategori tidak ditemukan" });
        }

        if (foundCategories.length === 0) {
            let defaultCategory = await CategoryModel.findOne({ name: 'other' });
            if (!defaultCategory) {
                return res.status(500).json({ message: 'Kategori default "other" tidak ditemukan' });
            }
            foundCategories = [defaultCategory];
        }

        // 🔹 Update `isNonMaterial` dan materials
        if (isNonMaterial === 'true' || isNonMaterial === true) {
            item.materials = [];
            item.isNonMaterial = true;
        } else {
            if (!materials || materials.length === 0) {
                return res.status(400).json({ message: 'Materials tidak boleh kosong jika item ini membutuhkan bahan baku' });
            }
            item.isNonMaterial = false;
            item.materials = await validateMaterials(materials);
        }

        // 🔹 Update field lainnya
        item.nama = nama || item.nama;
        item.hargaBeli = hargaBeli || item.hargaBeli;
        item.hargaJual = hargaJual || item.hargaJual;
        item.stok = stok || item.stok;
        item.categoryId = foundCategories.map(cat => cat._id);
        item.image = imagePath;

        await item.save();
        res.status(200).json({ message: 'Item berhasil diperbarui', item });

    } catch (error) {
        errorLogs(error.message, req, res);
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        if (!validateObjectId(id)) return res.status(400).json({ message: 'ID tidak valid' });

        const item = await ItemModel.findById(id);
        if (!item) return res.status(404).json({ message: 'Item tidak ditemukan' });

        // 🔹 Hapus gambar jika ada
        if (item.image) {
            const oldImagePath = path.join(__dirname, '../../', item.image);
            if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }

        await item.deleteOne()
        res.status(200).json({ message: 'Item berhasil dihapus' });

    } catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};



const validateMaterials = async (materials) => {
    if (typeof materials === "string") {
        materials = JSON.parse(materials);
    }

    if (!Array.isArray(materials) || materials.length === 0) {
        throw new Error("Materials harus berupa array dan tidak boleh kosong");
    }


    const materialIds = materials.map(mat => {
        if (!mat.materialId) {
            throw new Error(`Material ID tidak ditemukan dalam salah satu bahan`);
        }
        return typeof mat.materialId === "object" ? mat.materialId._id : mat.materialId;
    });


    const existingMaterials = await MaterialModel.find({ _id: { $in: materialIds } });

    if (existingMaterials.length !== new Set(materialIds).size) {
        throw new Error("Beberapa material tidak ditemukan di database");
    }

    return materials.map(mat => {
        const materialId = typeof mat.materialId === "object" ? mat.materialId._id : mat.materialId;
        const materialExists = existingMaterials.find(m => m._id.toString() === materialId);

        if (!materialExists) {
            throw new Error(`Material dengan ID ${materialId} tidak ditemukan`);
        }
        if (!mat.unitPerMaterial || mat.unitPerMaterial.trim() === "") {
            throw new Error(`unitPerMaterial harus diisi untuk material ${materialExists.name}`);
        }
        if (!mat.quantityPerMaterial || mat.quantityPerMaterial <= 0) {
            throw new Error(`quantityPerMaterial harus lebih dari 0 untuk material ${materialExists.name}`);
        }

        return {
            materialId,
            unitPerMaterial: mat.unitPerMaterial,
            quantityPerMaterial: mat.quantityPerMaterial,
        };
    });
};
