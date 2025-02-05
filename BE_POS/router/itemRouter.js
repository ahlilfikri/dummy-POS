const CrudItemController = require('../controller/itemController/crud');
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadImage');

router.post('/', upload.single('image'), CrudItemController.createItem);
// http://localhost:3000/be/api/pos/item

router.get('/', CrudItemController.getAllItem);
// http://localhost:3000/be/api/pos/item?page=1&limit=10

router.get('/cashier', CrudItemController.getAllItemCashier);
// http://localhost:3000/be/api/pos/item?page=1&limit=10

router.get('/:id', CrudItemController.getItemById);
// http://localhost:3000/be/api/pos/item/60e0d0b8c9c1d4f1c8b0e3d9

router.put('/:id', upload.single('image'), CrudItemController.updateItem);
// http://localhost:3000/be/api/pos/item/60e0d0b8c9c1d4f1c8b0e3d9

router.delete('/:id', CrudItemController.deleteItem);
// http://localhost:3000/be/api/pos/item/60e0d0b8c9c1d4f1c8b0e3d9

module.exports = router;
