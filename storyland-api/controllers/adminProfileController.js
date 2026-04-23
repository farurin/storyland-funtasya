const db = require("../config/db");
const bcrypt = require("bcrypt");

// GET: Ambil data profil admin
const getAdminProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const sql =
      "SELECT first_name, last_name, email, phone_number, gender, avatar_url FROM users WHERE id = ?";
    const [results] = await db.query(sql, [userId]);

    if (results.length === 0)
      return res.status(404).json({ message: "Admin tidak ditemukan" });

    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: Update profil admin (Teks + Upload Foto)
const updateAdminProfile = async (req, res) => {
  const userId = req.user.id;
  const { firstName, lastName, email, phone, gender } = req.body;
  let avatarUrl = req.body.existing_avatar;

  if (req.files && req.files.length > 0) {
    avatarUrl = req.files[0].path;
  }

  try {
    const sql = `
      UPDATE users 
      SET first_name = ?, last_name = ?, email = ?, phone_number = ?, gender = ?, avatar_url = ? 
      WHERE id = ?
    `;
    await db.query(sql, [
      firstName,
      lastName,
      email,
      phone,
      gender,
      avatarUrl,
      userId,
    ]);

    res.json({ message: "Profil berhasil diperbarui!", avatar_url: avatarUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: Update Password
const updateAdminPassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    const [users] = await db.query("SELECT password FROM users WHERE id = ?", [
      userId,
    ]);
    if (users.length === 0)
      return res.status(404).json({ message: "User tidak ditemukan" });

    const validPassword = await bcrypt.compare(
      currentPassword,
      users[0].password,
    );
    if (!validPassword)
      return res.status(400).json({ message: "Password saat ini salah!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      userId,
    ]);
    res.json({ message: "Password berhasil diubah!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAdminProfile,
  updateAdminProfile,
  updateAdminPassword,
};
