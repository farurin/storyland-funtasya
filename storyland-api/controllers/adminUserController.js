const db = require("../config/db");

// GET ALL USERS (End-Users & Admins)
const getAllUsers = async (req, res) => {
  try {
    // Sesuaikan nama kolom dengan struktur tabel users aslimu
    const sql = `
      SELECT 
        id, 
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

    // Format data agar lebih rapi saat diterima Frontend
    const formattedUsers = users.map((u) => ({
      id: u.id,
      name: u.last_name ? `${u.first_name} ${u.last_name}` : u.first_name,
      email: u.email,
      role: u.role || "user", // user, admin, super_admin, editor
      status: u.status || "active",
      avatar: u.avatar_url || "https://via.placeholder.com/150",
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

module.exports = {
  getAllUsers,
};
