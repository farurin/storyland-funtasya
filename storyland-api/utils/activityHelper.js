const db = require("../config/db");

const recordUserActivity = async (userId) => {
  try {
    // 1. Dapatkan tanggal hari ini (berdasarkan waktu lokal / WIB)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const todayStr = `${year}-${month}-${day}`; // Format YYYY-MM-DD

    // 2. Masukkan ke log aktivitas (IGNORE jika user sudah login hari ini, menghindari data ganda)
    const logSql =
      "INSERT IGNORE INTO user_activity_logs (id_user, activity_date) VALUES (?, ?)";
    await db.query(logSql, [userId, todayStr]);

    // 3. Ambil data user dari database
    const userSql =
      "SELECT current_streak, last_active_date FROM users WHERE id = ?";
    const [userResults] = await db.query(userSql, [userId]);

    if (userResults.length === 0) return;

    const user = userResults[0];

    // 4. Format last_active_date dari database
    let lastDateStr = null;
    if (user.last_active_date) {
      const ld = new Date(user.last_active_date);
      const ly = ld.getFullYear();
      const lm = String(ld.getMonth() + 1).padStart(2, "0");
      const lday = String(ld.getDate()).padStart(2, "0");
      lastDateStr = `${ly}-${lm}-${lday}`;
    }

    let newStreak = user.current_streak || 0;

    // Jika last_active_date sama dengan hari ini, hentikan proses (streak sudah aman)
    if (lastDateStr === todayStr) return;

    // 5. Dapatkan tanggal kemarin
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yy = yesterday.getFullYear();
    const ym = String(yesterday.getMonth() + 1).padStart(2, "0");
    const yday = String(yesterday.getDate()).padStart(2, "0");
    const yesterdayStr = `${yy}-${ym}-${yday}`;

    // 6. Hitung Streak Baru
    if (lastDateStr === yesterdayStr) {
      newStreak += 1; // Jika kemarin dia login, tambah streak-nya
    } else {
      newStreak = 1; // Jika bolong login lebih dari 1 hari, reset ke 1
    }

    // 7. Simpan Streak Baru ke Database
    const updateSql =
      "UPDATE users SET current_streak = ?, last_active_date = ? WHERE id = ?";
    await db.query(updateSql, [newStreak, todayStr, userId]);
  } catch (error) {
    console.error("Gagal update aktivitas dan streak harian:", error);
  }
};

module.exports = { recordUserActivity };
