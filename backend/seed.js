const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");

async function seed() {
    console.log("Memulai proses pembuatan database dan tabel...");
    
    // Connect tanpa memilih database
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: ""
    });

    console.log("Terkoneksi ke MySQL.");

    // Buat database jika belum ada
    await connection.query(`CREATE DATABASE IF NOT EXISTS pengaduan_masyarakat;`);
    console.log("Database 'pengaduan_masyarakat' berhasil dipastikan ada.");

    // Gunakan database tersebut
    await connection.query(`USE pengaduan_masyarakat;`);

    // Drop tabel (jika ada) - urutan drop penting karena ada Foreign Key
    await connection.query(`DROP TABLE IF EXISTS comments;`);
    await connection.query(`DROP TABLE IF EXISTS laporan;`);
    await connection.query(`DROP TABLE IF EXISTS categories;`);
    await connection.query(`DROP TABLE IF EXISTS users;`);

    console.log("Tabel lama berhasil dihapus.");

    // Buat tabel users
    await connection.query(`
        CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            username VARCHAR(50),
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('admin', 'user') DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Buat tabel categories
    await connection.query(`
        CREATE TABLE categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL
        );
    `);

    // Buat tabel laporan
    await connection.query(`
        CREATE TABLE laporan (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            image VARCHAR(255),
            location_name VARCHAR(255),
            latitude VARCHAR(50),
            longitude VARCHAR(50),
            status ENUM('pending', 'approved', 'rejected', 'diproses', 'selesai', 'ditolak') DEFAULT 'pending',
            user_id INT NOT NULL,
            category_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        );
    `);

    // Buat tabel comments
    await connection.query(`
        CREATE TABLE comments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            laporan_id INT NOT NULL,
            user_id INT NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (laporan_id) REFERENCES laporan(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    console.log("Semua tabel berhasil dibuat!");

    // Data Seeding
    const hashedPassword = await bcrypt.hash("password123", 10);

    // 1 Admin, 2 Random Users
    await connection.query(
        `INSERT INTO users (name, username, email, password, role) VALUES ?`,
        [[
            ["Administrator", "admin", "admin@lama.com", hashedPassword, "admin"],
            ["Budi Santoso", "budi123", "budi@gmail.com", hashedPassword, "user"],
            ["Siti Aminah", "siti_a", "siti@gmail.com", hashedPassword, "user"]
        ]]
    );

    // Categories
    await connection.query(
        `INSERT INTO categories (name) VALUES ?`,
        [[
            ["Infrastruktur & Jalan"],
            ["Sanitasi & Lingkungan"],
            ["Dampak Bencana Alam"],
            ["Fasilitas Sosial"],
            ["Lainnya"]
        ]]
    );

    // Dummy Laporan
    await connection.query(
        `INSERT INTO laporan (title, description, image, status, user_id, category_id) VALUES ?`,
        [[
            ["Jalan Berlubang di Sudirman", "Terdapat jalan berlubang cukup dalam yang membahayakan pengendara motor.", "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800", "pending", 2, 1],
            ["Tumpukan Sampah di Pasar", "Sampah tidak diangkut selama 3 hari menyebabkan bau tidak sedap.", "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800", "diproses", 3, 2]
        ]]
    );

    // Dummy Comment
    await connection.query(
        `INSERT INTO comments (laporan_id, user_id, content) VALUES ?`,
        [[
            [1, 3, "Iya nih bahaya banget, kemarin hampir jatuh juga."],
            [1, 1, "Terima kasih atas laporannya, akan segera ditindaklanjuti oleh dinas terkait."]
        ]]
    );

    console.log("Data awal (Seeding) berhasil dimasukkan!");
    
    await connection.end();
    console.log("Proses Selesai!");
    process.exit(0);
}

seed().catch(err => {
    console.error("Error saat seeding:", err);
    process.exit(1);
});
