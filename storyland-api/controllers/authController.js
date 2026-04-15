const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middlewares/authMiddleware");
const { recordUserActivity } = require("../utils/activityHelper");

const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Cek apakah email sudah ada
    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar!" });
    }

    // 2. Hash Password & Buat Username
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const username = email.split("@")[0];

    // 3. Masukkan ke Database
    const [result] = await db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
    );

    // 4. Buat Token
    const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // 5. Catat Aktivitas
    recordUserActivity(result.insertId);

    // 6. Kirim Response
    res.status(201).json({
      message: "Pendaftaran sukses!",
      token,
      user: { id: result.insertId, username, email },
    });
  } catch (error) {
    console.error("Error Register:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Cari user berdasarkan email
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (results.length === 0) {
      return res.status(401).json({ message: "Email atau password salah!" });
    }

    const user = results[0];

    // 2. Cocokkan Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email atau password salah!" });
    }

    // 3. Buat Token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // 4. Catat Aktivitas
    recordUserActivity(user.id);

    // 5. Kirim Response
    res.json({
      message: "Login sukses!",
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Error Login:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
};

module.exports = { register, login };
