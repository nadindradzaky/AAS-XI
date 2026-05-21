const express = require("express");
const router = express.Router();

const authController = require("../controllers/authControllers");
const verifyToken = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/profile", verifyToken, authController.getProfile);
router.get("/users", verifyToken, checkRole("admin"), authController.getAllUsers);


module.exports = router;