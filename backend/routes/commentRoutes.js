const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, commentController.addComment);
router.get("/:laporanId", commentController.getComments);

module.exports = router;