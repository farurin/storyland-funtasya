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

// fungsi cek status favorit & simpan
const getBookStatus = (req, res) => {
  const userId = req.user.id;
  const bookId = req.params.id;

  const sqlFav =
    "SELECT id FROM user_favorites WHERE id_user = ? AND id_book = ?";
  const sqlSaved =
    "SELECT id FROM user_saved WHERE id_user = ? AND id_book = ?";

  db.query(sqlFav, [userId, bookId], (err, favResults) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query(sqlSaved, [userId, bookId], (err, savedResults) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        isFavorite: favResults.length > 0,
        isSaved: savedResults.length > 0,
      });
    });
  });
};

// fungsi toggle favorit
const toggleFavorite = (req, res) => {
  const userId = req.user.id;
  const bookId = req.params.id;

  const checkSql =
    "SELECT id FROM user_favorites WHERE id_user = ? AND id_book = ?";
  db.query(checkSql, [userId, bookId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      // Jika sudah ada, hapus (Unfavorite)
      db.query(
        "DELETE FROM user_favorites WHERE id_user = ? AND id_book = ?",
        [userId, bookId],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ isFavorite: false, message: "Dihapus dari favorit" });
        },
      );
    } else {
      // Jika belum ada, tambahkan (Favorite)
      db.query(
        "INSERT INTO user_favorites (id_user, id_book) VALUES (?, ?)",
        [userId, bookId],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ isFavorite: true, message: "Ditambahkan ke favorit" });
        },
      );
    }
  });
};

// fungsi toggle simpan
const toggleSaved = (req, res) => {
  const userId = req.user.id;
  const bookId = req.params.id;

  const checkSql =
    "SELECT id FROM user_saved WHERE id_user = ? AND id_book = ?";
  db.query(checkSql, [userId, bookId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      db.query(
        "DELETE FROM user_saved WHERE id_user = ? AND id_book = ?",
        [userId, bookId],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ isSaved: false, message: "Dihapus dari simpanan" });
        },
      );
    } else {
      db.query(
        "INSERT INTO user_saved (id_user, id_book) VALUES (?, ?)",
        [userId, bookId],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ isSaved: true, message: "Disimpan untuk nanti" });
        },
      );
    }
  });
};

// module export
module.exports = {
  getCategories,
  getBooks,
  getBookPages,
  finishBook,
  getBookStatus,
  toggleFavorite,
  toggleSaved,
};
