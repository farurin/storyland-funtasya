const db = require("../config/db");

// 1. GET ALL CATEGORIES (Khusus Admin, ambil semua termasuk yang inactive)
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

// 2. CREATE CATEGORY
const createCategory = async (req, res) => {
  const { name, description, status } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: "Nama dan Deskripsi wajib diisi!" });
  }

  try {
    // Catatan: Untuk image_icon, image_banner, image_card sementara kita isi default/null
    // Nanti akan di-upgrade menggunakan Multer & Cloudinary saat integrasi upload file
    const sql = `INSERT INTO categories (name, description, status, image_icon, image_banner, image_card) 
                 VALUES (?, ?, ?, 'default-icon.png', 'default-banner.png', 'default-card.png')`;

    const [result] = await db.query(sql, [
      name,
      description,
      status || "active",
    ]);

    res.status(201).json({
      message: "Kategori berhasil ditambahkan!",
      insertId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. UPDATE CATEGORY (Nama & Deskripsi)
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const sql = "UPDATE categories SET name = ?, description = ? WHERE id = ?";
    await db.query(sql, [name, description, id]);

    res.json({ message: "Kategori berhasil diperbarui!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. UPDATE STATUS (Aktif / Nonaktif)
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

// 5. DELETE CATEGORY
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
