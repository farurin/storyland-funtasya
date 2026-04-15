const db = require("../config/db");

const getCategories = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM categories");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBooks = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM books");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBookPages = async (req, res) => {
  try {
    const sql =
      "SELECT * FROM book_pages WHERE id_book = ? ORDER BY page_number ASC";
    const [results] = await db.query(sql, [req.params.id]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const finishBook = async (req, res) => {
  const userId = req.user.id;
  const bookId = req.params.id;

  try {
    // cek apakah buku sudah ada di riwayat
    const [existing] = await db.query(
      "SELECT id FROM user_progress WHERE id_user = ? AND id_book = ?",
      [userId, bookId],
    );

    if (existing.length > 0) {
      // jika ada, timpa menjadi 100% dan status 'completed'
      await db.query(
        "UPDATE user_progress SET reading_progress = 100, status = 'completed', last_read_at = NOW() WHERE id_user = ? AND id_book = ?",
        [userId, bookId],
      );
    } else {
      // jika belum ada, buat baru
      await db.query(
        "INSERT INTO user_progress (id_user, id_book, reading_progress, status, last_read_at) VALUES (?, ?, 100, 'completed', NOW())",
        [userId, bookId],
      );
    }

    // update misi
    const missionSql = `
      UPDATE user_missions um
      JOIN missions m ON um.id_mission = m.id
      SET um.progress = um.progress + 1
      WHERE um.id_user = ? AND um.is_claimed = FALSE AND um.progress < m.max_progress
    `;
    await db.query(missionSql, [userId]);

    res.json({
      message: "Sinyal diterima! Buku selesai dan progres misi bertambah.",
    });
  } catch (err) {
    console.error("Gagal mencatat riwayat selesai:", err);
    res.status(500).json({ error: err.message });
  }
};

// catat progress bacaan
const updateProgress = async (req, res) => {
  const userId = req.user.id;
  const bookId = req.params.id;
  const { progress } = req.body;

  try {
    // cek apakah buku sudah ada di riwayat
    const [existing] = await db.query(
      "SELECT id FROM user_progress WHERE id_user = ? AND id_book = ?",
      [userId, bookId],
    );

    if (existing.length > 0) {
      // Jika ada, timpa progress-nya dan ubah status ke 'reading'
      await db.query(
        "UPDATE user_progress SET reading_progress = ?, status = 'reading', last_read_at = NOW() WHERE id_user = ? AND id_book = ?",
        [progress, userId, bookId],
      );
    } else {
      // Jika belum ada, buat baru dan set status ke 'reading'
      await db.query(
        "INSERT INTO user_progress (id_user, id_book, reading_progress, status, last_read_at) VALUES (?, ?, ?, 'reading', NOW())",
        [userId, bookId, progress],
      );
    }

    res.json({ message: "Progres baca diperbarui!" });
  } catch (err) {
    console.error("Gagal update progres:", err);
    res.status(500).json({ error: err.message });
  }
};

const getBookStatus = async (req, res) => {
  const userId = req.user.id;
  const bookId = req.params.id;

  try {
    const [favResults] = await db.query(
      "SELECT id FROM user_favorites WHERE id_user = ? AND id_book = ?",
      [userId, bookId],
    );
    const [savedResults] = await db.query(
      "SELECT id FROM user_saved WHERE id_user = ? AND id_book = ?",
      [userId, bookId],
    );

    res.json({
      isFavorite: favResults.length > 0,
      isSaved: savedResults.length > 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const toggleFavorite = async (req, res) => {
  const userId = req.user.id;
  const bookId = req.params.id;

  try {
    const [results] = await db.query(
      "SELECT id FROM user_favorites WHERE id_user = ? AND id_book = ?",
      [userId, bookId],
    );

    if (results.length > 0) {
      await db.query(
        "DELETE FROM user_favorites WHERE id_user = ? AND id_book = ?",
        [userId, bookId],
      );
      res.json({ isFavorite: false, message: "Dihapus dari favorit" });
    } else {
      await db.query(
        "INSERT INTO user_favorites (id_user, id_book) VALUES (?, ?)",
        [userId, bookId],
      );
      res.json({ isFavorite: true, message: "Ditambahkan ke favorit" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const toggleSaved = async (req, res) => {
  const userId = req.user.id;
  const bookId = req.params.id;

  try {
    const [results] = await db.query(
      "SELECT id FROM user_saved WHERE id_user = ? AND id_book = ?",
      [userId, bookId],
    );

    if (results.length > 0) {
      await db.query(
        "DELETE FROM user_saved WHERE id_user = ? AND id_book = ?",
        [userId, bookId],
      );
      res.json({ isSaved: false, message: "Dihapus dari simpanan" });
    } else {
      await db.query(
        "INSERT INTO user_saved (id_user, id_book) VALUES (?, ?)",
        [userId, bookId],
      );
      res.json({ isSaved: true, message: "Disimpan untuk nanti" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getCategories,
  getBooks,
  getBookPages,
  finishBook,
  getBookStatus,
  toggleFavorite,
  toggleSaved,
  updateProgress,
};
