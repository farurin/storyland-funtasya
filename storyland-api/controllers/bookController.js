const db = require("../config/db");

const getCategories = (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const getBooks = (req, res) => {
  db.query("SELECT * FROM books", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const getBookPages = (req, res) => {
  const sql =
    "SELECT * FROM book_pages WHERE id_book = ? ORDER BY page_number ASC";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// fungsi selesai membaca
const finishBook = (req, res) => {
  const userId = req.user.id;
  const bookId = req.params.id;

  // catat di history
  const progressSql = `
    INSERT INTO user_progress (id_user, id_book, reading_progress, last_read_at) 
    VALUES (?, ?, 100, NOW())
    ON DUPLICATE KEY UPDATE reading_progress = 100, last_read_at = NOW()
  `;

  db.query(progressSql, [userId, bookId], (err) => {
    if (err) console.error("Gagal mencatat riwayat:", err);

    // update misi
    const missionSql = `
      UPDATE user_missions um
      JOIN missions m ON um.id_mission = m.id
      SET um.progress = um.progress + 1
      WHERE um.id_user = ? AND um.is_claimed = FALSE AND um.progress < m.max_progress
    `;

    db.query(missionSql, [userId], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        message: "Sinyal diterima! Buku selesai dan progres misi bertambah.",
      });
    });
  });
};

module.exports = { getCategories, getBooks, getBookPages, finishBook };
