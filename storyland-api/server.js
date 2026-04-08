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

// API kategori
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

// API ambil semua data buku
app.get("/api/books", (req, res) => {
  const sql = "SELECT * FROM books";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Gagal mengambil buku:", err);
      return res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
    res.json(results);
  });
});

// API halaman Corner

// Karena belum ada sistem login betulan (JWT/Session),
// kita asumsikan yang sedang login adalah user ID 1
const ID_USER_AKTIF = 1;

// [API] 1. Mengambil Buku Favorit
app.get("/api/corner/favorites", (req, res) => {
  const sql = `
    SELECT b.* FROM user_favorites uf
    JOIN books b ON uf.id_book = b.id
    WHERE uf.id_user = ?
  `;
  db.query(sql, [ID_USER_AKTIF], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// [API] 2. Mengambil Buku Disimpan
app.get("/api/corner/saved", (req, res) => {
  const sql = `
    SELECT b.* FROM user_saved us
    JOIN books b ON us.id_book = b.id
    WHERE us.id_user = ?
  `;
  db.query(sql, [ID_USER_AKTIF], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// [API] 3. Mengambil Riwayat Bacaan (Progress)
app.get("/api/corner/history", (req, res) => {
  const sql = `
    SELECT b.*, up.reading_progress, up.last_read_at 
    FROM user_progress up
    JOIN books b ON up.id_book = b.id
    WHERE up.id_user = ?
    ORDER BY up.last_read_at DESC
  `;
  db.query(sql, [ID_USER_AKTIF], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Jalankan server di port 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server Backend berjalan di http://localhost:${PORT}`);
});
