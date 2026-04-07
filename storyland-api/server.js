const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors()); // Mengizinkan React mengakses API ini
app.use(express.json()); // Agar bisa menerima data format JSON dari React

// Konfigurasi koneksi ke Laragon MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Default user Laragon adalah 'root'
  password: "", // Default password Laragon biasanya kosong (tidak ada password)
  database: "funtasya_storyland",
});

// Cek Koneksi Database
db.connect((err) => {
  if (err) {
    console.error("Gagal terkoneksi ke MySQL Laragon:", err);
    return;
  }
  console.log("Berhasil terkoneksi ke database funtasya_storyland!");
});

// Route sederhana untuk mengetes API
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Funtasya StoryLand API" });
});

app.get("/api/categories", (req, res) => {
  const sql = "SELECT * FROM categories";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Gagal mengambil kategori:", err);
      return res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
    res.json(results);
  });
});

// Jalankan server di port 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server Backend berjalan di http://localhost:${PORT}`);
});
