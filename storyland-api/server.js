const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "rahasia_funtasya_super_aman_123";

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

// --- API AUTENTIKASI ---

// [API] 1. Register Akun Baru
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cek apakah email sudah dipakai
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0)
          return res.status(400).json({ message: "Email sudah terdaftar!" });

        // Hash password (Mengacak password jadi karakter rahasia)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Ambil kata depan email sebagai username default (misal: fiyana@gmail.com -> fiyana)
        const username = email.split("@")[0];

        // Simpan ke database
        const insertSql =
          "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        db.query(
          insertSql,
          [username, email, hashedPassword],
          (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            // Buatkan tiket (Token JWT) agar setelah daftar langsung login
            const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET, {
              expiresIn: "1d",
            });

            res.status(201).json({
              message: "Pendaftaran sukses!",
              token,
              user: { id: result.insertId, username, email },
            });
          },
        );
      },
    );
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

// [API] 2. Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      // Jika email tidak ditemukan
      if (results.length === 0)
        return res.status(401).json({ message: "Email atau password salah!" });

      const user = results[0];

      // Bandingkan password yang diketik dengan password acak di database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Email atau password salah!" });

      // Jika cocok, buatkan tiket JWT
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "1d",
      });

      res.json({
        message: "Login sukses!",
        token,
        user: { id: user.id, username: user.username, email: user.email },
      });
    },
  );
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

// API ambil halaman cerita berdasarkan ID Buku
app.get("/api/books/:id/pages", (req, res) => {
  const bookId = req.params.id;
  const sql =
    "SELECT * FROM book_pages WHERE id_book = ? ORDER BY page_number ASC";

  db.query(sql, [bookId], (err, results) => {
    if (err) {
      console.error(`Gagal mengambil halaman untuk buku ${bookId}:`, err);
      return res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
    res.json(results);
  });
});

// API halaman Corner

// 1. Middleware untuk mengecek Token JWT
const verifyToken = (req, res, next) => {
  // Mengambil token dari header (Format: "Bearer <token>")
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Akses ditolak. Silakan login." });

  try {
    // Membuka token menggunakan kunci rahasia
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // Menyimpan data user (id, email) dari token ke request
    next(); // Lolos, silakan lanjut ke API
  } catch (error) {
    res
      .status(400)
      .json({ message: "Token tidak valid atau sudah kedaluwarsa." });
  }
};

// [API] 1. Mengambil Buku Favorit (Sekarang dilindungi verifyToken)
app.get("/api/corner/favorites", verifyToken, (req, res) => {
  const userId = req.user.id; // Mengambil ID dari token yang valid

  const sql = `
    SELECT b.* FROM user_favorites uf
    JOIN books b ON uf.id_book = b.id
    WHERE uf.id_user = ?
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// [API] 2. Mengambil Buku Disimpan (Dilindungi verifyToken)
app.get("/api/corner/saved", verifyToken, (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT b.* FROM user_saved us
    JOIN books b ON us.id_book = b.id
    WHERE us.id_user = ?
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// [API] 3. Mengambil Riwayat Bacaan (Dilindungi verifyToken)
app.get("/api/corner/history", verifyToken, (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT b.*, up.reading_progress, up.last_read_at 
    FROM user_progress up
    JOIN books b ON up.id_book = b.id
    WHERE up.id_user = ?
    ORDER BY up.last_read_at DESC
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Jalankan server di port 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server Backend berjalan di http://localhost:${PORT}`);
});
