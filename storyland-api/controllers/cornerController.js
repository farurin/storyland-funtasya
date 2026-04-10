const db = require("../config/db");

const getFavorites = (req, res) => {
  const sql =
    "SELECT b.* FROM user_favorites uf JOIN books b ON uf.id_book = b.id WHERE uf.id_user = ?";
  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const getSaved = (req, res) => {
  const sql =
    "SELECT b.* FROM user_saved us JOIN books b ON us.id_book = b.id WHERE us.id_user = ?";
  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const getHistory = (req, res) => {
  const sql =
    "SELECT b.*, up.reading_progress, up.last_read_at FROM user_progress up JOIN books b ON up.id_book = b.id WHERE up.id_user = ? ORDER BY up.last_read_at DESC";
  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

module.exports = { getFavorites, getSaved, getHistory };
