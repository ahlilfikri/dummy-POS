const matrialController = require('../controller/materialController/crud');

const express = require('express');
const router = express.Router();

router.post('/', matrialController.createMaterial);
// http://localhost:3000/be/api/pos/material

router.get('/name', matrialController.getAllMaterialsNameAndId);
// http://localhost:3000/be/api/pos/material/name

router.get('/', matrialController.getAllMaterials);
// http://localhost:3000/be/api/pos/material?page=1&limit=10

router.get('/:id', matrialController.getMaterialById);
// http://localhost:3000/be/api/pos/material/60e0d0b8c9c1d4f1c8b0e3d9

router.put('/:id', matrialController.updateMaterial);
// http://localhost:3000/be/api/pos/material/60e0d0b8c9c1d4f1c8b0e3d9

router.delete('/:id', matrialController.deleteMaterial);
// http://localhost:3000/be/api/pos/material/60e0d0b8c9c1d4f1c8b0e3d9


module.exports = router;
