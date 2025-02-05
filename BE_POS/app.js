const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
    cors()
);
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true }));

app.use("/be/uploads", (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
});
app.use("/uploads/item", express.static(path.join(__dirname, "uploads/item")));
// http://localhost:3876/be/uploads/item/60e0d0b8c9c1d4f1c8b0e3d9.jpg

app.use("/uploads/qrcodes", express.static(path.join(__dirname, "uploads/qrcodes")));
// http://localhost:3876/be/uploads/qrcodes/60e0d0b8c9c1d4f1c8b0e3d9.png

app.use("/uploads/evidence", express.static(path.join(__dirname, "uploads/evidence")));
// http://localhost:3876/be/uploads/evidence/60e0d0b8c9c1d4f1c8b0e3d9.jpg




// API
app.use("/be/api/pos", require("./router/indexRouter"));
// http://localhost:3876/be/api/pos

app.use("/be/api/pos/auth", require("./router/authRouter"));
// http://localhost:3876/be/api/pos/auth/login

app.use("/be/api/pos/user", require("./router/userRouter"));
// http://localhost:3876/be/api/user

app.use("/be/api/pos/item", require("./router/itemRouter"));
// http://localhost:3876/be/api/pos/item

app.use("/be/api/pos/transaction", require("./router/transactionRouter"));
// http://localhost:3876/be/api/pos/transaction

app.use("/be/api/pos/material", require("./router/materialRouter"));
// http://localhost:3876/be/api/pos/material

app.use("/be/api/pos/category", require("./router/categoryRouter"));
// http://localhost:3876/be/api/pos/category

app.use("/be/api/pos/oprational", require("./router/oprationalRouter"));
// http://localhost:3876/be/api/pos/oprational

module.exports = app;
