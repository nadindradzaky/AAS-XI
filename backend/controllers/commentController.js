const db = require("../config/db");

exports.addComment = (req, res) => {
    const { laporan_id, content } = req.body;
    const user_id = req.user.id; // From verifyToken middleware

    if (!laporan_id || !content) {
        return res.status(400).json({ message: "laporan_id and content are required" });
    }

    const sql = "INSERT INTO comments (laporan_id, user_id, content) VALUES (?, ?, ?)";
    db.query(sql, [laporan_id, user_id, content], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ message: "Komentar berhasil ditambahkan" });
    });
};

exports.getComments = (req, res) => {
    const { laporanId } = req.params;
    
    const sql = `
        SELECT c.id, c.content, c.created_at, u.name as user_name 
        FROM comments c 
        JOIN users u ON c.user_id = u.id 
        WHERE c.laporan_id = ? 
        ORDER BY c.created_at ASC
    `;
    
    db.query(sql, [laporanId], (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(results);
    });
};
