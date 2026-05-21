const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name,email,password) VALUES (?,?,?)";

    db.query(sql, [name, email, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "Register berhasil"
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "User tidak ditemukan"
            });
        }

        const user = result[0];

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(401).json({
                message: "Password salah"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login berhasil",
            token
        });
    });
};

exports.getProfile = (req, res) => {
    const userId = req.user.id;
    
    const sqlUser = "SELECT id, name, username, email, role, created_at FROM users WHERE id = ?";
    db.query(sqlUser, [userId], (err, userResults) => {
        if (err) return res.status(500).json(err);
        if (userResults.length === 0) return res.status(404).json({ message: "User not found" });
        
        const user = userResults[0];
        
        const sqlReports = `
            SELECT l.*, c.name as category_name 
            FROM laporan l
            LEFT JOIN categories c ON l.category_id = c.id
            WHERE l.user_id = ? 
            ORDER BY l.created_at DESC
        `;
        db.query(sqlReports, [userId], (err, reportResults) => {
            if (err) return res.status(500).json(err);
            
            res.json({
                user: user,
                reports: reportResults,
                total_reports: reportResults.length
            });
        });
    });
};

exports.getAllUsers = (req, res) => {
    const sql = "SELECT id, name, username, email, role, created_at FROM users ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};