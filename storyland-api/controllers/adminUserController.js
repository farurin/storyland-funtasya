const db = require("../config/db");
const bcrypt = require("bcrypt");

// GET ALL USERS (End-Users & Admins)
const getAllUsers = async (req, res) => {
  try {
    const sql = `
      SELECT 
        id, 
        username,
        first_name, 
        last_name, 
        email, 
        role, 
        status, 
        avatar_url,
        created_at 
      FROM users 
      ORDER BY created_at DESC
    `;
    const [users] = await db.query(sql);

    const formattedUsers = users.map((u) => ({
      id: u.id,
      // Jika first_name null, otomatis gunakan username
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

  // 1. Validasi Input Dasar
  if (!firstName || !email || !role || !password) {
    return res
      .status(400)
      .json({ message: "Nama Depan, Email, Role, dan Password wajib diisi!" });
  }

  try {
    // 2. Cek apakah email sudah terdaftar
    const [existingEmail] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );
    if (existingEmail.length > 0) {
      return res
        .status(400)
        .json({ message: "Email sudah digunakan oleh pengguna lain!" });
    }

    // 3. Hash Password untuk keamanan
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Generate Username Otomatis dari Email
    let baseUsername = email.split("@")[0];
    let finalUsername = baseUsername;
    let isUnique = false;
    let counter = 1;

    // Pastikan username tidak bentrok di database
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

    // 5. Insert Data ke Database
    const sql = `
      INSERT INTO users (
        username, first_name, last_name, email, role, password, status
      ) VALUES (?, ?, ?, ?, ?, ?, 'active')
    `;

    await db.query(sql, [
      finalUsername,
      firstName,
      lastName || null, // Opsional
      email,
      role,
      hashedPassword,
    ]);

    res.status(201).json({ message: "Pengguna baru berhasil ditambahkan!" });
  } catch (err) {
    console.error("Gagal menambahkan pengguna:", err);
    res
      .status(500)
      .json({
        message: "Terjadi kesalahan internal server.",
        error: err.message,
      });
  }
};

module.exports = {
  getAllUsers,
  createAdminUser,
};
