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

// CREATE BOOK MULTI-LANGUAGE
const createBook = async (req, res) => {
  // 1. Ekstraksi data teks
  const { title, description, id_categories, status } = req.body;
  const scenes = JSON.parse(req.body.scenes || "[]");

  if (!title || !description || !id_categories) {
    return res
      .status(400)
      .json({ message: "Judul, Deskripsi, dan Kategori wajib diisi!" });
  }

  // 2. Ekstraksi URL File dari Cloudinary
  let coverImageUrl = "default-cover.png";
  let bgMusicUrl = null;

  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      if (file.fieldname === "cover_image") coverImageUrl = file.path;
      if (file.fieldname === "bg_music") bgMusicUrl = file.path;

      // Menangkap file scene (gambar & 2 dubbing)
      if (file.fieldname.startsWith("scene_image_")) {
        const index = parseInt(file.fieldname.split("_")[2]);
        if (scenes[index]) scenes[index].imageUrl = file.path;
      }
      if (file.fieldname.startsWith("scene_dubbing_id_")) {
        const index = parseInt(file.fieldname.split("_")[3]);
        if (scenes[index]) scenes[index].dubbingIdUrl = file.path;
      }
      if (file.fieldname.startsWith("scene_dubbing_en_")) {
        const index = parseInt(file.fieldname.split("_")[3]);
        if (scenes[index]) scenes[index].dubbingEnUrl = file.path;
      }
    });
  }

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // 3. Simpan ke tabel `books`
    const sqlBook = `
      INSERT INTO books (id_categories, title, description, image, bg_music_url, status, views_count, is_recommended, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, 0, 0, NOW())
    `;
    const [bookResult] = await conn.query(sqlBook, [
      id_categories,
      title,
      description,
      coverImageUrl,
      bgMusicUrl,
      status,
    ]);

    const newBookId = bookResult.insertId;

    // 4. Simpan ke tabel `book_pages`
    if (scenes.length > 0) {
      const sqlPage = `
        INSERT INTO book_pages (id_book, page_number, image, dubbing_id_url, dubbing_en_url, text_id, text_en) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];

        const text_id = scene.subtitleId || "";
        const text_en = scene.subtitleEn || "";
        const imgUrl = scene.imageUrl || "default-scene.png";
        const dubIdUrl = scene.dubbingIdUrl || null;
        const dubEnUrl = scene.dubbingEnUrl || null;

        await conn.query(sqlPage, [
          newBookId,
          i + 1,
          imgUrl,
          dubIdUrl,
          dubEnUrl,
          text_id,
          text_en,
        ]);
      }
    }

    await conn.commit();
    res.status(201).json({
      message: "Buku berhasil ditambahkan beserta dua bahasanya!",
      bookId: newBookId,
    });
  } catch (err) {
    await conn.rollback();
    console.error("Database Error:", err);
    res.status(500).json({ error: "Gagal menyimpan buku: " + err.message });
  } finally {
    conn.release();
  }
};

// GET ADMIN BOOK DETAIL (Buku + Scenes)
const getAdminBookDetail = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Ambil data utama buku
    const sqlBook = `
      SELECT b.*, c.name AS category_name
      FROM books b
      LEFT JOIN categories c ON b.id_categories = c.id
      WHERE b.id = ?
    `;
    const [bookResults] = await db.query(sqlBook, [id]);

    if (bookResults.length === 0) {
      return res.status(404).json({ message: "Buku tidak ditemukan" });
    }

    const book = bookResults[0];

    // 2. Ambil data halamannya (scenes)
    const sqlPages = `
      SELECT * FROM book_pages 
      WHERE id_book = ? 
      ORDER BY page_number ASC
    `;
    const [pageResults] = await db.query(sqlPages, [id]);

    // 3. Format data
    const responseData = {
      id: book.id,
      title: book.title,
      author: "Funtasya Team", // Hardcoded
      date: new Date(book.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      category: book.category_name,
      status: book.status,
      cover_image: book.image,
      bg_music: book.bg_music_url,
      scenes: pageResults.map((page) => ({
        page_number: page.page_number,
        image: page.image,
        text_id: page.text_id,
        text_en: page.text_en,
        dubbing_id_url: page.dubbing_id_url,
        dubbing_en_url: page.dubbing_en_url,
        has_dubbing_id: !!page.dubbing_id_url,
        has_dubbing_en: !!page.dubbing_en_url,
      })),
    };

    res.json(responseData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE BOOK STATUS (Terbit / Ditolak)
const updateBookStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["terbit", "ditolak", "review", "arsip", "dihapus"].includes(status)) {
    return res.status(400).json({ message: "Status tidak valid" });
  }

  try {
    const sql = "UPDATE books SET status = ? WHERE id = ?";
    await db.query(sql, [status, id]);
    res.json({
      message: `Buku berhasil diubah menjadi ${status.toUpperCase()}!`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAdminBooks,
  createBook,
  getAdminBookDetail,
  updateBookStatus,
};
