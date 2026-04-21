const db = require("../config/db");

// GET ALL BOOKS UNTUK ADMIN
const getAdminBooks = async (req, res) => {
  try {
    const sql = `
      SELECT 
        b.id, 
        b.title, 
        b.description, 
        b.image, 
        b.status, 
        b.views_count,
        b.created_at,
        c.name AS category_name
      FROM books b
      LEFT JOIN categories c ON b.id_categories = c.id
      ORDER BY b.created_at DESC
    `;

    const [results] = await db.query(sql);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAdminBooks,
};
