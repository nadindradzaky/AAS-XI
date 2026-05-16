const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
    res.send("Create comment");
});

router.get("/:laporanId", (req, res) => {
    res.send("Get comments for laporan");
});

router.delete("/:id", (req, res) => {
    res.send("Delete comment");
});

module.exports = router;