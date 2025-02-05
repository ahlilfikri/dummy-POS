const oprationalController = require('../controller/oprationalControlles/crudOprational');
const oprationalAdmin = require('../controller/oprationalControlles/oprationalAdmin');
const oprationalStaff = require('../controller/oprationalControlles/oprasionalStaff');
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/UserAuthentication');
const upload = require('../middlewares/uploadImage');

router.post('/', protect, oprationalController.createOprational);
// http://localhost:3876/be/api/pos/oprational/

router.get('/', oprationalController.getAllOprational);
// http://localhost:3876/be/api/pos/oprational/

router.get('/:id', protect, oprationalController.getOprationalById);
// http://localhost:3876/be/api/pos/oprational/612f7b1b4b1f2b0015f3b3b1

router.put('/:id', protect, oprationalController.updateOprational);
// http://localhost:3876/be/api/pos/oprational/612f7b1b4b1f2b0015f3b3b1

router.delete('/:id', protect, oprationalController.deleteOprational);
// http://localhost:3876/be/api/pos/oprational/612f7b1b4b1f2b0015f3b3b1

router.put('/approval/:id', protect, oprationalAdmin.approveOprational);
// http://localhost:3876/be/api/pos/oprational/approval/612f7b1b4b1f2b0015f3b3b1

router.post('/upload/evidence/:id', upload.single('image'), oprationalController.uploadEvidence);
// http://localhost:3876/be/api/pos/oprational/upload/evidence/612f7b1b4b1f2b0015f3b3b1

router.post('/upload/evidence/:id', upload.single('image'), oprationalStaff.uploadEvidence);
// http://localhost:3876/be/api/pos/oprational/upload/evidence/612f7b1b4b1f2b0015f3b3b1

router.post('/upload/evidence/:id', upload.single('image'), oprationalController.uploadEvidence);
// http://localhost:3876/be/api/pos/oprational/upload/evidence/612f7b1b4b1f2b0015f3b3b1

router.get('/allnon/pagination', oprationalController.getAllnonpaginated);
// http://localhost:3876/be/api/pos/oprational/allnon/pagination

module.exports = router;
