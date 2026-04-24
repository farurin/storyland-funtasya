const db = require("../config/db");

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
