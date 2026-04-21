const db = require("../config/db");

// GET ALL CATEGORIES (Khusus Admin, ambil semua termasuk yang inactive)
const getAdminCategories = async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT * FROM categories ORDER BY id DESC",
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create category

const createCategory = async (req, res) => {
  const { name, description, status } = req.body;
  if (!name || !description)
    return res.status(400).json({ message: "Nama dan Deskripsi wajib diisi!" });

  try {
    const image_icon =
      req.files && req.files["image_icon"]
        ? req.files["image_icon"][0].path
        : "default-icon.png";
    const image_banner =
      req.files && req.files["image_banner"]
        ? req.files["image_banner"][0].path
        : "default-banner.png";
    const image_card =
      req.files && req.files["image_card"]
        ? req.files["image_card"][0].path
        : "default-card.png";

    const sql = `INSERT INTO categories (name, description, status, image_icon, image_banner, image_card) VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(sql, [
      name,
      description,
      status || "active",
      image_icon,
      image_banner,
      image_card,
    ]);

    res
      .status(201)
      .json({
        message: "Kategori berhasil ditambahkan!",
        insertId: result.insertId,
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    let sql = "UPDATE categories SET name = ?, description = ?";
    let params = [name, description];

    // Cek apakah ada file baru yang diupload, jika ada, update URL-nya
    if (req.files) {
      if (req.files["image_icon"]) {
        sql += ", image_icon = ?";
        params.push(req.files["image_icon"][0].path);
      }
      if (req.files["image_banner"]) {
        sql += ", image_banner = ?";
        params.push(req.files["image_banner"][0].path);
      }
      if (req.files["image_card"]) {
        sql += ", image_card = ?";
        params.push(req.files["image_card"][0].path);
      }
    }

    sql += " WHERE id = ?";
    params.push(id);

    await db.query(sql, params);
    res.json({ message: "Kategori berhasil diperbarui!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE STATUS (Aktif / Nonaktif)
const updateCategoryStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'active' atau 'inactive'

  try {
    const sql = "UPDATE categories SET status = ? WHERE id = ?";
    await db.query(sql, [status, id]);

    res.json({ message: `Status kategori berhasil diubah menjadi ${status}!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE CATEGORY
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // PENTING: Cek apakah ada buku yang memakai kategori ini
    const [books] = await db.query(
      "SELECT id FROM books WHERE id_categories = ?",
      [id],
    );

    if (books.length > 0) {
      return res.status(400).json({
        message: `Gagal menghapus! Ada ${books.length} buku yang masih menggunakan kategori ini.`,
      });
    }

    await db.query("DELETE FROM categories WHERE id = ?", [id]);
    res.json({ message: "Kategori berhasil dihapus permanen!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAdminCategories,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
};
