const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Kasir API works!");
});

module.exports = router;
