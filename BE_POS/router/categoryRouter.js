const categoryController = require('../controller/categoryController/crud');

const express = require('express');
const router = express.Router();

router.post('/', categoryController.createCategory);
// http://localhost:3000/be/api/pos/category

router.get('/', categoryController.getAllCategory);
// http://localhost:3000/be/api/pos/category?page=1&limit=10

router.get('/all/form', categoryController.getAllCategoryForItemInput);
// http://localhost:3000/be/api/pos/category/all/form

router.get('/:id', categoryController.getCategoryById);
// http://localhost:3000/be/api/pos/category/60e0d0b8c9c1d4f1c8b0e3d9

router.put('/:id', categoryController.updateCategory);
// http://localhost:3000/be/api/pos/category/60e0d0b8c9c1d4f1c8b0e3d9

router.delete('/:id', categoryController.deleteCategory);
// http://localhost:3000/be/api/pos/category/60e0d0b8c9c1d4f1c8b0e3d9

module.exports = router;
