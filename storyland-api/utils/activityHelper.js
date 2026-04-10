const db = require("../config/db");

const recordUserActivity = (userId) => {
  const today = new Date().toISOString().slice(0, 10);

  const logSql =
    "INSERT IGNORE INTO user_activity_logs (id_user, activity_date) VALUES (?, ?)";
  db.query(logSql, [userId, today], (err) => {
    if (err) return console.error("Gagal catat log:", err);

    const userSql =
      "SELECT current_streak, last_active_date FROM users WHERE id = ?";
    db.query(userSql, [userId], (err, results) => {
      if (err || results.length === 0) return;

      const user = results[0];
      const lastDate = user.last_active_date
        ? new Date(
            user.last_active_date.getTime() -
              user.last_active_date.getTimezoneOffset() * 60000,
          )
            .toISOString()
            .slice(0, 10)
        : null;

      let newStreak = user.current_streak;

      if (lastDate === today) return; // Sudah aktif hari ini

      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterday = yesterdayDate.toISOString().slice(0, 10);

      if (lastDate === yesterday) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }

      const updateSql =
        "UPDATE users SET current_streak = ?, last_active_date = ? WHERE id = ?";
      db.query(updateSql, [newStreak, today, userId], (err) => {
        if (err) console.error("Gagal update streak:", err);
      });
    });
  });
};

module.exports = { recordUserActivity };
