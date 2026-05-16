const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const authRoutes = require("./routes/authRoutes");
const verifyToken = require("./middleware/authMiddleware");
const checkRole = require("./middleware/roleMiddleware");
const laporanRoutes = require("./routes/laporanRoutes");
const commentRoutes = require("./routes/commentRoutes");

app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);
app.use("/laporan", laporanRoutes);
app.use("/comments", commentRoutes);

app.get("/", (req, res) => {
    res.send("Backend jalan cuy");
});

app.get("/profile", verifyToken, (req, res) => {
    res.json({
        message: "Berhasil akses profile",
        user: req.user
    });
});

app.get(
    "/admin",
    verifyToken,
    checkRole("admin"),
    (req, res) => {

        res.json({
            message: "Selamat datang admin"
        });

    }
);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running di port ${process.env.PORT || 3000}`);
});