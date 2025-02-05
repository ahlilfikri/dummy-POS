const express = require('express');
const router = express.Router();
const CurdUserController = require('../controller/userPosController/crud');
const { protect, authorize } = require('../middlewares/UserAuthentication');

// Role-based authorization untuk admin saja
// router.post('/', protect, authorize(['admin']), CurdUserController.createUser);
router.post('/', CurdUserController.createUser);
// http://localhost:3876/be/api/pos/user/

router.get('/', protect, CurdUserController.getAllUser);
// http://localhost:3876/be/api/pos/user/

router.get('/:id', protect, CurdUserController.getUserById);
// http://localhost:3876/be/api/pos/user/612f7b1b4b1f2b0015f3b3b1

router.put('/:id', protect, authorize(['admin']), CurdUserController.updateUser);
// http://localhost:3876/be/api/pos/user/612f7b1b4b1f2b0015f3b3b1

router.delete('/:id', protect, authorize(['admin']), CurdUserController.deleteUser);
// http://localhost:3876/be/api/pos/user/612f7b1b4b1f2b0015f3b3b1

module.exports = router;
