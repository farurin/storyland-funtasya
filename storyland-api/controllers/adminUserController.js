const db = require("../config/db");
const bcrypt = require("bcryptjs");

// GET ALL USERS (End-Users & Admins)
const getAllUsers = async (req, res) => {
  try {
    const sql = `
      SELECT 
        id, username, first_name, last_name, email, role, status, avatar_url, created_at 
      FROM users 
      ORDER BY created_at DESC
    `;
    const [users] = await db.query(sql);

    const formattedUsers = users.map((u) => ({
      id: u.id,
      firstName: u.first_name || "",
      lastName: u.last_name || "",
      name: u.first_name
        ? u.last_name
          ? `${u.first_name} ${u.last_name}`
          : u.first_name
        : u.username,
      email: u.email,
      role: u.role || "user",
      status: u.status || "active",
      avatar: u.avatar_url || "https://placehold.co/150x150?text=Avatar",
      date: new Date(u.created_at).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));

    res.json(formattedUsers);
  } catch (err) {
    console.error("Gagal mengambil data user:", err);
    res.status(500).json({ error: err.message });
  }
};

// CREATE ADMIN USER
const createAdminUser = async (req, res) => {
  const { firstName, lastName, email, role, password } = req.body;
  if (!firstName || !email || !role || !password) {
    return res
      .status(400)
      .json({ message: "Nama Depan, Email, Role, dan Password wajib diisi!" });
  }
  try {
    const [existingEmail] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );
    if (existingEmail.length > 0)
      return res
        .status(400)
        .json({ message: "Email sudah digunakan oleh pengguna lain!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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

    const sql = `INSERT INTO users (username, first_name, last_name, email, role, password, status) VALUES (?, ?, ?, ?, ?, ?, 'active')`;
    await db.query(sql, [
      finalUsername,
      firstName,
      lastName || null,
      email,
      role,
      hashedPassword,
    ]);

    res.status(201).json({ message: "Pengguna baru berhasil ditambahkan!" });
  } catch (err) {
    console.error("Gagal menambahkan pengguna:", err);
    res.status(500).json({
      message: "Terjadi kesalahan internal server.",
      error: err.message,
    });
  }
};

// UPDATE ADMIN USER
const updateAdminUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, role, password } = req.body;

  if (!firstName || !email || !role) {
    return res
      .status(400)
      .json({ message: "Nama Depan, Email, dan Role wajib diisi!" });
  }

  try {
    // Cek apakah email dipakai oleh user lain (selain dirinya sendiri)
    const [existingEmail] = await db.query(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [email, id],
    );
    if (existingEmail.length > 0) {
      return res
        .status(400)
        .json({ message: "Email sudah digunakan oleh pengguna lain!" });
    }

    // Jika password diisi, maka update beserta passwordnya
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await db.query(
        "UPDATE users SET first_name=?, last_name=?, email=?, role=?, password=? WHERE id=?",
        [firstName, lastName || null, email, role, hashedPassword, id],
      );
    } else {
      // Jika password kosong, jangan update password (biarkan yang lama)
      await db.query(
        "UPDATE users SET first_name=?, last_name=?, email=?, role=? WHERE id=?",
        [firstName, lastName || null, email, role, id],
      );
    }

    res.json({ message: "Data pengguna berhasil diperbarui!" });
  } catch (err) {
    console.error("Gagal update pengguna:", err);
    res.status(500).json({
      message: "Terjadi kesalahan internal server.",
      error: err.message,
    });
  }
};

// DELETE ADMIN USER (Hard Delete)
const deleteAdminUser = async (req, res) => {
  const { id } = req.params;

  try {
    // PROTEKSI: Cek agar user tidak menghapus akunnya sendiri
    if (req.user && req.user.id === parseInt(id)) {
      return res
        .status(400)
        .json({
          message:
            "Tindakan ditolak! Anda tidak dapat menghapus akun Anda sendiri.",
        });
    }

    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan." });
    }

    res.json({ message: "Akses dicabut dan akun berhasil dihapus permanen!" });
  } catch (err) {
    console.error("Gagal menghapus pengguna:", err);
    res
      .status(500)
      .json({
        message: "Terjadi kesalahan internal server.",
        error: err.message,
      });
  }
};

// Pastikan untuk mengekspor fungsi baru ini
module.exports = {
  getAllUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
};
