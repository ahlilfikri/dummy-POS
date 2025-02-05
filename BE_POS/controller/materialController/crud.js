const e = require('cors');
const MaterialModel = require('../../model/materialModel');
const { errorLogs } = require('../../utils/logging');

exports.createMaterial = async (req, res) => {
    try {
        const { name, unit, stock, hargaBeli } = req.body;

        const newMaterial = new MaterialModel({
            name,
            unit,
            stock,
            hargaBeli,
        });

        await newMaterial.save();

        res.status(201).json({ message: 'Material berhasil dibuat', material: newMaterial });
    } catch (error) {
        errorLogs(error.message, req, res);
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};


exports.getAllMaterials = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        const totalCount = await MaterialModel.countDocuments({
            name: { $regex: search, $options: 'i' }
        });

        const totalPages = Math.ceil(totalCount / limit);

        const materials = await MaterialModel.find({
            name: { $regex: search, $options: 'i' }
        })
            .skip(skip)
            .limit(limit);

        if (materials.length === 0) {
            return res.status(404).json({ message: 'Material belum ada' });
        }

        res.status(200).json({
            materials,
            totalCount,
            totalPages,
            currentPage: page,
        });

    } catch (error) {
        errorLogs(error.message, req, res);
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};

exports.getAllMaterialsNameAndId = async (req, res) => {
    try {
        const materials = await MaterialModel.find().select('name unit');
        if (materials.length === 0) {
            return res.status(404).json({ message: 'Material belum ada' });
        }

        res.status(200).json({ materials });

    } catch (error) {
        errorLogs(error.message, req, res);
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
}


exports.getMaterialById = async (req, res) => {
    try {
        const material = await MaterialModel.findById(req.params.id);
        if (!material) {
            return res.status(404).json({ message: 'Material tidak ditemukan' });
        }

        res.status(200).json({ material });

    } catch (error) {
        errorLogs(error.message, req, res);
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};


exports.updateMaterial = async (req, res) => {
    try {
        const { name, unit, stock, hargaBeli } = req.body;

        const material = await MaterialModel.findById(req.params.id);
        if (!material) {
            return res.status(404).json({ message: 'Material tidak ditemukan' });
        }

        material.name = name || material.name;
        material.unit = unit || material.unit;
        material.stock = stock || material.stock;
        material.hargaBeli = hargaBeli || material.hargaBeli;

        await material.save();

        res.status(200).json({ message: 'Material berhasil diupdate', material });

    } catch (error) {
        errorLogs(error.message, req, res);
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};


exports.deleteMaterial = async (req, res) => {
    try {
        const material = await MaterialModel.findById(req.params.id);
        if (!material) {
            return res.status(404).json({ message: 'Material tidak ditemukan' });
        }

        await MaterialModel.deleteOne({ _id: req.params.id });

        res.status(200).json({
            message: 'Material berhasil dihapus',
            material: {
                _id: material._id,
                name: material.name
            }
        });
    } catch (error) {
        errorLogs(error.message, req, res);
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
};
