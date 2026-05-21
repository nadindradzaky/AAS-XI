const mysql = require("mysql2/promise");

async function updateDb() {
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "pengaduan_masyarakat"
    });

    try {
        await connection.query("ALTER TABLE laporan ADD COLUMN location_name VARCHAR(255)");
        await connection.query("ALTER TABLE laporan ADD COLUMN latitude VARCHAR(50)");
        await connection.query("ALTER TABLE laporan ADD COLUMN longitude VARCHAR(50)");
        console.log("Berhasil menambahkan kolom lokasi");
    } catch(err) {
        if(err.code === 'ER_DUP_FIELDNAME') {
           console.log("Kolom sudah ada, aman.");
        } else {
           console.error(err);
        }
    }
    await connection.end();
}

updateDb();
