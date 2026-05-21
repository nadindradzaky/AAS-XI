const db = require("../config/db");



exports.createLaporan = (req, res) => {

    const { title, description, category_id, location_name, latitude, longitude } = req.body;   

    const image = req.file ? req.file.filename : null;

    const user_id = req.user.id;

    const sql = `
        INSERT INTO laporan
        (title, description, category_id, user_id, image, location_name, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [title, description, category_id, user_id, image, location_name, latitude, longitude],
        
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Laporan berhasil ditambah"
            });

        }
    );
};



exports.getLaporan = (req, res) => {

    const sql = `
        SELECT * FROM laporan
    `;

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }
        res.json(result);

    });
};



exports.getDetailLaporan = (req, res) => {

    const id = req.params.id;

    const sql = `
        SELECT * FROM laporan
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    });
};



exports.updateLaporan = (req, res) => {

    const id = req.params.id;

    const { title, description, status } = req.body;

    const sql = `
        UPDATE laporan
        SET title = ?, description = ?, status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [title, description, status, id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Laporan berhasil diupdate"
            });

        }
    );
};



exports.deleteLaporan = (req, res) => {

    const id = req.params.id;

    const sql = `
        DELETE FROM laporan
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "Laporan berhasil dihapus"
        });

    });
};


exports.getLaporanById = async (req, res) => {
   try {

      const { id } = req.params;

      const query = `
      SELECT 
         laporan.id,
         laporan.title,
         laporan.description,
         laporan.image,
         laporan.status,
         users.username,
         categories.name AS category
      FROM laporan
      JOIN users 
         ON laporan.user_id = users.id
      JOIN categories 
         ON laporan.category_id = categories.id
      WHERE laporan.id = ?
      `;

      db.query(query, [id], (err, result) => {

         if (err) {
            return res.status(500).json({
               message: err.message
            });
         }

         if (result.length === 0) {
            return res.status(404).json({
               message: "Laporan tidak ditemukan"
            });
         }

         res.status(200).json(result[0]);

      });

   } catch (error) {

      res.status(500).json({
         message: error.message
      });

   }
};

exports.updateStatus = (req, res) => {
    const id = req.params.id;
    const { status } = req.body;

    const sql = `
        UPDATE laporan
        SET status = ?
        WHERE id = ?
    `;

    db.query(sql, [status, id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "Status laporan berhasil diubah"
        });
    });
};