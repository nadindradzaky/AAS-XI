const express = require("express");

const router = express.Router();


const laporanController = require("../controllers/laporanController");

const verifyToken = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post(
    "/",
    verifyToken,
    upload.single("image"),
    laporanController.createLaporan
);

router.get(
    "/",
    laporanController.getLaporan
);


router.get(
    "/:id",
    verifyToken,
    laporanController.getDetailLaporan
);


router.put(
    "/:id",
    verifyToken,
    laporanController.updateLaporan
);


router.delete(
    "/:id",
    verifyToken,
    laporanController.deleteLaporan
);

router.patch(
    "/:id/status",
    verifyToken,
    checkRole("admin"),
    laporanController.updateStatus
);

module.exports = router;