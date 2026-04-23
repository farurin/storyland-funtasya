const db = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    // 1. STATISTIK UTAMA (Cards)
    const [[{ totalBooks }]] = await db.query(
      "SELECT COUNT(*) AS totalBooks FROM books",
    );
    const [[{ totalUsers }]] = await db.query(
      "SELECT COUNT(*) AS totalUsers FROM users WHERE role = 'user'",
    );
    const [[{ totalViews }]] = await db.query(
      "SELECT SUM(views_count) AS totalViews FROM books",
    );
    const [[{ totalCategories }]] = await db.query(
      "SELECT COUNT(*) AS totalCategories FROM categories",
    );

    // 2. STATUS BUKU (Populer & Terbaru)
    // HAPUS b.author karena tidak ada di DB Funtasya
    const [popularBooks] = await db.query(`
      SELECT b.id, b.title, b.image AS img, c.name AS category, b.views_count 
      FROM books b LEFT JOIN categories c ON b.id_categories = c.id 
      WHERE b.status = 'terbit' ORDER BY b.views_count DESC LIMIT 4
    `);

    const [latestBooks] = await db.query(`
      SELECT b.id, b.title, b.image AS img, c.name AS category 
      FROM books b LEFT JOIN categories c ON b.id_categories = c.id 
      WHERE b.status = 'terbit' ORDER BY b.created_at DESC LIMIT 4
    `);

    // 3. STATISTIK DEMOGRAFI (Persentase per Kategori)
    const [categoryStats] = await db.query(`
      SELECT c.name AS label, COUNT(b.id) AS count
      FROM categories c
      LEFT JOIN books b ON c.id = b.id_categories AND b.status = 'terbit'
      GROUP BY c.id, c.name
    `);

    const validTotalBooks = totalBooks || 1; // Hindari pembagian dengan nol
    const colors = [
      "#FBBF24",
      "#FB923C",
      "#3B82F6",
      "#1D4ED8",
      "#A855F7",
      "#F87171",
      "#EF4444",
    ];

    const demography = categoryStats.map((cat, index) => ({
      label: cat.label,
      count: cat.count,
      pct: Math.round((cat.count / validTotalBooks) * 100),
      color: colors[index % colors.length], // Rotasi warna dinamis
    }));

    // 4. MANAJEMEN BUKU (Sidebar - 5 Buku Terbaru)
    const recentSidebarBooks = latestBooks.slice(0, 5);

    // 5. MANAJEMEN AUTOR
    const authors = [
      { name: "Funtasya Team", jumlah: totalBooks || 0 },
      { name: "Admin Funtasya", jumlah: popularBooks.length || 0 },
    ];

    // Kirim balasan JSON ke Frontend
    res.json({
      stats: {
        totalBooks,
        totalUsers,
        totalViews: totalViews || 0,
        totalCategories,
      },
      bookStatus: {
        popular: popularBooks,
        latest: latestBooks,
        downloaded: popularBooks, // Placeholder
      },
      demography,
      recentSidebarBooks,
      authors,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getDashboardStats };
