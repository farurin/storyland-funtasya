const db = require("../config/db");

const getFavorites = async (req, res) => {
  try {
    const sql =
      "SELECT b.* FROM user_favorites uf JOIN books b ON uf.id_book = b.id WHERE uf.id_user = ?";
    const [results] = await db.query(sql, [req.user.id]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSaved = async (req, res) => {
  try {
    const sql =
      "SELECT b.*, us.saved_at FROM user_saved us JOIN books b ON us.id_book = b.id WHERE us.id_user = ? ORDER BY us.saved_at DESC";
    const [results] = await db.query(sql, [req.user.id]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const sql =
      "SELECT b.*, up.reading_progress, up.last_read_at FROM user_progress up JOIN books b ON up.id_book = b.id WHERE up.id_user = ? ORDER BY up.last_read_at DESC";
    const [results] = await db.query(sql, [req.user.id]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getFavorites, getSaved, getHistory };
