const CurdPembelianController = require("../controller/transactionController/crud");
const TransactionController = require("../controller/transactionController/transactionController")
const express = require("express");
const router = express.Router();

router.post("/", CurdPembelianController.createtransactionSchema);
// http://localhost:3000/pembelian

router.get("/", CurdPembelianController.getAlltransactionSchema);
// http://localhost:3000/pembelian?page=1&limit=10

router.get("/today", CurdPembelianController.getAlltransactionSchemaByToday);
// http://localhost:3000/pembelian/today

router.get("/sales", CurdPembelianController.getSalesInRange);
// http://localhost:3000/transaction/sales

router.get("/:id", CurdPembelianController.gettransactionSchemaById);
// http://localhost:3000/pembelian/60e0d0b8c9c1d4f1c8b0e3d9

router.put("/:id", CurdPembelianController.updatetransactionSchema);
// http://localhost:3000/pembelian/60e0d0b8c9c1d4f1c8b0e3d9

router.delete("/:id", CurdPembelianController.deletetransactionSchema);
// http://localhost:3000/pembelian/60e0d0b8c9c1d4f1c8b0e3d9

router.post("/create/transaction", TransactionController.createTransaction);
// http://localhost:3876/be/api/pos/transaction/create/transaction

router.post("/reduce/material", TransactionController.redusStockMaterial);
// http://localhost:3876/be/api/pos/transaction/reduce/material


module.exports = router;
