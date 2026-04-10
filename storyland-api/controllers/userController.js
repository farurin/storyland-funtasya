const db = require("../config/db");

const getCharacters = (req, res) => {
  const userId = req.user.id;
  const sql = `
    SELECT c.id, c.name, c.image_url AS image, 
           EXISTS(SELECT 1 FROM user_characters uc WHERE uc.id_character = c.id AND uc.id_user = ?) AS isUnlocked,
           (u.active_character_id = c.id) AS isActive
    FROM characters c
    JOIN users u ON u.id = ?
    ORDER BY c.id ASC
  `;
  db.query(sql, [userId, userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const formattedResults = results.map((char) => ({
      ...char,
      isUnlocked: char.isUnlocked === 1,
      isActive: char.isActive === 1,
    }));
    res.json(formattedResults);
  });
};

const updateActiveCharacter = (req, res) => {
  const userId = req.user.id;
  const { characterId } = req.body;
  if (!characterId)
    return res.status(400).json({ message: "ID Karakter wajib dikirim" });

  const checkSql =
    "SELECT * FROM user_characters WHERE id_user = ? AND id_character = ?";
  db.query(checkSql, [userId, characterId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(403).json({ message: "Akses ditolak!" });

    const updateSql = "UPDATE users SET active_character_id = ? WHERE id = ?";
    db.query(updateSql, [characterId, userId], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Karakter berhasil diubah!" });
    });
  });
};

const getUserProfile = (req, res) => {
  const userId = req.user.id;
  const sqlUser =
    "SELECT username, email, age, avatar_url, current_streak, total_points, current_rank FROM users WHERE id = ?";

  db.query(sqlUser, [userId], (err, userResults) => {
    if (err) return res.status(500).json({ error: err.message });
    if (userResults.length === 0)
      return res.status(404).json({ message: "User tidak ditemukan" });

    const user = userResults[0];
    const sqlAchievements =
      "SELECT COUNT(*) AS total_achievements FROM user_characters WHERE id_user = ? AND id_character > 7";

    db.query(sqlAchievements, [userId], (err, achievementResults) => {
      const totalAchievements = err
        ? 0
        : achievementResults[0].total_achievements;
      const sqlActivity =
        "SELECT activity_date FROM user_activity_logs WHERE id_user = ? AND activity_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)";

      db.query(sqlActivity, [userId], (err, activityResults) => {
        const activeDates = activityResults
          ? activityResults.map((row) => {
              const d = new Date(
                row.activity_date.getTime() -
                  row.activity_date.getTimezoneOffset() * 60000,
              );
              return d.toISOString().slice(0, 10);
            })
          : [];

        const daysName = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
        const calendar = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          calendar.push({
            day: daysName[d.getDay()],
            date: d.getDate(),
            isActive: activeDates.includes(d.toISOString().slice(0, 10)),
            isToday: i === 0,
          });
        }

        res.json({
          ...user,
          rank: user.current_rank || 0,
          total_achievements: totalAchievements,
          calendar: calendar,
        });
      });
    });
  });
};

const getLeaderboard = (req, res) => {
  // Query ambil 30 user teratas
  const sql = `
    SELECT 
      u.id, 
      u.username AS name, 
      u.avatar_url AS avatar, 
      u.current_streak AS streak, 
      u.total_pages AS pages,
      (SELECT COUNT(*) FROM user_characters uc WHERE uc.id_user = u.id AND uc.id_character > 7) AS awards
    FROM users u
    ORDER BY u.total_points DESC, u.current_streak DESC
    LIMIT 30
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const leaderboard = results.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    res.json(leaderboard);
  });
};

module.exports = {
  getCharacters,
  updateActiveCharacter,
  getUserProfile,
  getLeaderboard,
};
