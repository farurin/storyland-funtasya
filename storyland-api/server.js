const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const JWT_SECRET = "rahasia_funtasya_super_aman_123";

// Middleware
app.use(cors());
app.use(express.json());

// Konfigurasi koneksi database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "funtasya_storyland",
});

db.connect((err) => {
  if (err) {
    console.error("Gagal terkoneksi ke MySQL Laragon:", err);
    return;
  }
  console.log("Berhasil terkoneksi ke database funtasya_storyland!");
});

// ==========================================
// --- FUNGSI PINTAR (HELPER) ---
// ==========================================

// Fungsi untuk Mencatat Aktivitas & Menghitung Streak
const recordUserActivity = (userId) => {
  const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD

  // 1. Masukkan ke log aktivitas (IGNORE agar tidak error jika double login di hari yang sama)
  const logSql =
    "INSERT IGNORE INTO user_activity_logs (id_user, activity_date) VALUES (?, ?)";

  db.query(logSql, [userId, today], (err) => {
    if (err) return console.error("Gagal catat log:", err);

    // 2. Ambil data terakhir untuk hitung streak
    const userSql =
      "SELECT current_streak, last_active_date FROM users WHERE id = ?";
    db.query(userSql, [userId], (err, results) => {
      if (err || results.length === 0) return;

      const user = results[0];
      // Ambil tanggal terakhir (sesuaikan zona waktu agar aman)
      const lastDate = user.last_active_date
        ? new Date(
            user.last_active_date.getTime() -
              user.last_active_date.getTimezoneOffset() * 60000,
          )
            .toISOString()
            .slice(0, 10)
        : null;

      let newStreak = user.current_streak;

      if (lastDate === today) {
        // Sudah aktif hari ini, abaikan
        return;
      }

      // Hitung tanggal kemarin
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterday = yesterdayDate.toISOString().slice(0, 10);

      if (lastDate === yesterday) {
        newStreak += 1; // Aktif berturut-turut
      } else {
        newStreak = 1; // Bolong, reset ke 1
      }

      // 3. Update data ke tabel users
      const updateSql =
        "UPDATE users SET current_streak = ?, last_active_date = ? WHERE id = ?";
      db.query(updateSql, [newStreak, today, userId], (err) => {
        if (err) console.error("Gagal update streak:", err);
      });
    });
  });
};

// ==========================================
// --- MIDDLEWARE AUTENTIKASI ---
// ==========================================
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Akses ditolak. Silakan login." });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res
      .status(400)
      .json({ message: "Token tidak valid atau sudah kedaluwarsa." });
  }
};

// ==========================================
// --- API ROUTES ---
// ==========================================

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Funtasya StoryLand API" });
});

// [API] Register
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0)
          return res.status(400).json({ message: "Email sudah terdaftar!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const username = email.split("@")[0];

        const insertSql =
          "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        db.query(
          insertSql,
          [username, email, hashedPassword],
          (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET, {
              expiresIn: "1d",
            });

            // Panggil pencatat aktivitas untuk pendaftar baru
            recordUserActivity(result.insertId);

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

// [API] Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(401).json({ message: "Email atau password salah!" });

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Email atau password salah!" });

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "1d",
      });

      // --- TRIGGER AKTIVITAS STREAK ---
      // Di sinilah fungsi itu bekerja secara otomatis setiap kali user login
      recordUserActivity(user.id);

      res.json({
        message: "Login sukses!",
        token,
        user: { id: user.id, username: user.username, email: user.email },
      });
    },
  );
});

// [API] Kategori & Buku
app.get("/api/categories", (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/api/books", (req, res) => {
  db.query("SELECT * FROM books", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/api/books/:id/pages", (req, res) => {
  const sql =
    "SELECT * FROM book_pages WHERE id_book = ? ORDER BY page_number ASC";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// [API] Corner (Favorites, Saved, History)
app.get("/api/corner/favorites", verifyToken, (req, res) => {
  const sql =
    "SELECT b.* FROM user_favorites uf JOIN books b ON uf.id_book = b.id WHERE uf.id_user = ?";
  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/api/corner/saved", verifyToken, (req, res) => {
  const sql =
    "SELECT b.* FROM user_saved us JOIN books b ON us.id_book = b.id WHERE us.id_user = ?";
  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/api/corner/history", verifyToken, (req, res) => {
  const sql =
    "SELECT b.*, up.reading_progress, up.last_read_at FROM user_progress up JOIN books b ON up.id_book = b.id WHERE up.id_user = ? ORDER BY up.last_read_at DESC";
  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// [API] Mengambil Semua Karakter & Status Unlocked User
app.get("/api/user/characters", verifyToken, (req, res) => {
  const userId = req.user.id;
  const sql = `
    SELECT 
        c.id, c.name, c.image_url AS image, 
        EXISTS(SELECT 1 FROM user_characters uc WHERE uc.id_character = c.id AND uc.id_user = ?) AS isUnlocked,
        (u.active_character_id = c.id) AS isActive
    FROM characters c
    JOIN users u ON u.id = ?
    ORDER BY c.id ASC
  `;
  db.query(sql, [userId, userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const formattedResults = results.map((char) => ({
      ...char,
      isUnlocked: char.isUnlocked === 1,
      isActive: char.isActive === 1,
    }));
    res.json(formattedResults);
  });
});

// [API] Menyimpan/Mengubah Karakter Aktif
app.put("/api/user/characters/active", verifyToken, (req, res) => {
  const userId = req.user.id;
  const { characterId } = req.body;
  if (!characterId)
    return res.status(400).json({ message: "ID Karakter wajib dikirim" });

  const checkSql =
    "SELECT * FROM user_characters WHERE id_user = ? AND id_character = ?";
  db.query(checkSql, [userId, characterId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(403).json({ message: "Akses ditolak!" });

    const updateSql = "UPDATE users SET active_character_id = ? WHERE id = ?";
    db.query(updateSql, [characterId, userId], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Karakter berhasil diubah!" });
    });
  });
});

// [API] Mengambil Data Profil, Statistik & Kalender User
app.get("/api/user/profile", verifyToken, (req, res) => {
  const userId = req.user.id;
  const sqlUser =
    "SELECT username, email, age, avatar_url, current_streak, total_points, current_rank FROM users WHERE id = ?";

  db.query(sqlUser, [userId], (err, userResults) => {
    if (err) return res.status(500).json({ error: err.message });
    if (userResults.length === 0)
      return res.status(404).json({ message: "User tidak ditemukan" });

    const user = userResults[0];
    const sqlAchievements =
      "SELECT COUNT(*) AS total_achievements FROM user_characters WHERE id_user = ? AND id_character > 7";

    db.query(sqlAchievements, [userId], (err, achievementResults) => {
      const totalAchievements = err
        ? 0
        : achievementResults[0].total_achievements;
      const sqlActivity =
        "SELECT activity_date FROM user_activity_logs WHERE id_user = ? AND activity_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)";

      db.query(sqlActivity, [userId], (err, activityResults) => {
        const activeDates = activityResults
          ? activityResults.map((row) => {
              // Normalisasi zona waktu agar tanggal tidak bergeser
              const d = new Date(
                row.activity_date.getTime() -
                  row.activity_date.getTimezoneOffset() * 60000,
              );
              return d.toISOString().slice(0, 10);
            })
          : [];

        const daysName = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
        const calendar = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          const dateString = d.toISOString().slice(0, 10);

          calendar.push({
            day: daysName[d.getDay()],
            date: d.getDate(),
            isActive: activeDates.includes(dateString),
            isToday: i === 0,
          });
        }

        res.json({
          ...user,
          rank: user.current_rank || 0,
          total_achievements: totalAchievements,
          calendar: calendar,
        });
      });
    });
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server Backend berjalan di http://localhost:${PORT}`);
});
