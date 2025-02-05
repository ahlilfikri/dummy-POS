const CategoryModel = require('../../model/categoryModels');
const { errorLogs } = require('../../utils/logging');

exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        // nama nga boleh sama
        const category = await CategoryModel.findOne({ name });
        if (category) {
            return res.status(400).json({ message: 'Category sudah ada' });
        }

        const newCategory = new CategoryModel({
            name,
            description
        });

        await newCategory.save();
        res.status(201).json({ message: 'Category berhasil dibuat', category: newCategory });

    } catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

exports.getAllCategory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        // Hitung total jumlah data
        const totalCount = await CategoryModel.countDocuments({
            name: { $regex: search, $options: 'i' }
        });

        // Hitung total halaman
        const totalPages = Math.ceil(totalCount / limit);

        const categories = await CategoryModel.find(
            {
                name: { $regex: search, $options: 'i' }
            }
        )
            .skip(skip)
            .limit(limit);

        if (categories.length === 0) {
            return res.status(404).json({ message: 'Category belum ada' });
        }

        res.status(200).json({
            categories,
            totalCount,
            totalPages,
            currentPage: page,
        });
    } catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

exports.getAllCategoryForItemInput = async (req, res) => {
    try {
        const categories = await CategoryModel.find()
            .select('_id name');

        if (categories.length === 0) {
            return res.status(404).json({ message: 'Category belum ada' });
        }

        res.status(200).json(categories);
    } catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await CategoryModel.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Category tidak ditemukan' });
        }

        res.status(200).json(category);

    } catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};



exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;


        const category = await CategoryModel.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Category tidak ditemukan' });
        }

        if (category.name === 'other') {
            return res.status(400).json({ message: 'Category ini tidak boleh diupdate' });
        }

        category.name = name;
        category.description = description;

        await category.save();
        res.status(200).json({ message: 'Category berhasil diupdate', category });
    } catch (error) {
        errorLogs(error.message, req, res);
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};




exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await CategoryModel.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({ message: 'Category tidak ditemukan' });
        }

        if (category.name === 'other') {
            return res.status(400).json({ message: 'Category ini tidak boleh dihapus' });
        }

        res.status(200).json({
            message: 'Category berhasil dihapus'
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: error.message
        });
    }
};
