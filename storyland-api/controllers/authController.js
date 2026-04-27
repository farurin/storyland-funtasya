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

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Buat Username Unik
    let baseUsername = email.split("@")[0];
    let finalUsername = baseUsername;
    let isUnique = false;
    let counter = 1;

    while (!isUnique) {
      const [checkUsername] = await db.query(
        "SELECT id FROM users WHERE username = ?",
        [finalUsername],
      );
      if (checkUsername.length === 0) {
        isUnique = true;
      } else {
        finalUsername = `${baseUsername}${counter}`;
        counter++;
      }
    }

    // 4. Masukkan ke Database
    const [result] = await db.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'user')",
      [finalUsername, email, hashedPassword],
    );

    // 5. Buat Token (Set role default 'user' untuk pendaftar baru)
    const token = jwt.sign(
      {
        id: result.insertId,
        email,
        role: "user",
      },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    // 6. Catat Aktivitas
    recordUserActivity(result.insertId);

    // 7. Kirim Response
    res.status(201).json({
      message: "Pendaftaran sukses!",
      token,
      user: {
        id: result.insertId,
        username: finalUsername,
        email,
        role: "user",
      },
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
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    // 4. Catat Aktivitas
    recordUserActivity(user.id);

    // 5. Kirim Response
    res.json({
      message: "Login sukses!",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error Login:", error);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
};

module.exports = { register, login };
