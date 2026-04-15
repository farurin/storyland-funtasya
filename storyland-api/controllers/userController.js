const db = require("../config/db");

const getCharacters = async (req, res) => {
  const userId = req.user.id;
  try {
    const sql = `
      SELECT c.id, c.name, c.image_url AS image, 
             EXISTS(SELECT 1 FROM user_characters uc WHERE uc.id_character = c.id AND uc.id_user = ?) AS isUnlocked,
             (u.active_character_id = c.id) AS isActive
      FROM characters c
      JOIN users u ON u.id = ?
      ORDER BY c.id ASC
    `;
    const [results] = await db.query(sql, [userId, userId]);

    const formattedResults = results.map((char) => ({
      ...char,
      isUnlocked: char.isUnlocked === 1,
      isActive: char.isActive === 1,
    }));

    res.json(formattedResults);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateActiveCharacter = async (req, res) => {
  const userId = req.user.id;
  const { characterId } = req.body;
  if (!characterId)
    return res.status(400).json({ message: "ID Karakter wajib dikirim" });

  try {
    const [results] = await db.query(
      "SELECT * FROM user_characters WHERE id_user = ? AND id_character = ?",
      [userId, characterId],
    );
    if (results.length === 0)
      return res.status(403).json({ message: "Akses ditolak!" });

    await db.query("UPDATE users SET active_character_id = ? WHERE id = ?", [
      characterId,
      userId,
    ]);
    res.json({ message: "Karakter berhasil diubah!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const [userResults] = await db.query(
      "SELECT username, email, age, avatar_url, current_streak, total_points, current_rank FROM users WHERE id = ?",
      [userId],
    );
    if (userResults.length === 0)
      return res.status(404).json({ message: "User tidak ditemukan" });
    const user = userResults[0];

    const [achievementResults] = await db.query(
      "SELECT COUNT(*) AS total_achievements FROM user_characters WHERE id_user = ? AND id_character > 7",
      [userId],
    );
    const totalAchievements = achievementResults[0].total_achievements;

    const [activityResults] = await db.query(
      "SELECT activity_date FROM user_activity_logs WHERE id_user = ? AND activity_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)",
      [userId],
    );

    const activeDates = activityResults.map((row) => {
      const d = new Date(
        row.activity_date.getTime() -
          row.activity_date.getTimezoneOffset() * 60000,
      );
      return d.toISOString().slice(0, 10);
    });

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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
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
    const [results] = await db.query(sql);

    const leaderboard = results.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMissions = async (req, res) => {
  const userId = req.user.id;
  try {
    const sql = `
      SELECT 
        m.id, m.title, m.description AS descr, m.max_progress AS maxProgress, 
        m.reward_points AS rewardPoints, m.badge_image AS badgeImg,
        COALESCE(um.progress, 0) AS progress,
        COALESCE(um.is_claimed, 0) AS isClaimed,
        (SELECT total_points FROM users WHERE id = ?) AS userTotalPoints
      FROM missions m
      LEFT JOIN user_missions um ON m.id = um.id_mission AND um.id_user = ?
    `;
    const [results] = await db.query(sql, [userId, userId]);
    const totalPoints = results.length > 0 ? results[0].userTotalPoints : 0;

    res.json({
      totalPoints: totalPoints,
      missions: results.map((row) => ({
        id: row.id,
        title: row.title,
        desc: row.descr,
        maxProgress: row.maxProgress,
        rewardPoints: row.rewardPoints,
        badgeImg: row.badgeImg,
        progress: row.progress,
        isClaimed: row.isClaimed === 1,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const claimMission = async (req, res) => {
  const userId = req.user.id;
  const missionId = req.params.id;

  try {
    const checkSql = `
      SELECT um.progress, m.max_progress, m.reward_points, um.is_claimed 
      FROM user_missions um
      JOIN missions m ON um.id_mission = m.id
      WHERE um.id_user = ? AND um.id_mission = ?
    `;
    const [results] = await db.query(checkSql, [userId, missionId]);

    if (results.length === 0)
      return res.status(404).json({ message: "Misi tidak ditemukan" });
    const mission = results[0];

    if (mission.is_claimed)
      return res.status(400).json({ message: "Hadiah sudah pernah diambil!" });
    if (mission.progress < mission.max_progress)
      return res.status(400).json({ message: "Misi belum selesai!" });

    await db.query(
      "UPDATE user_missions SET is_claimed = TRUE WHERE id_user = ? AND id_mission = ?",
      [userId, missionId],
    );
    await db.query(
      "UPDATE users SET total_points = total_points + ? WHERE id = ?",
      [mission.reward_points, userId],
    );

    res.json({
      message: "Berhasil mengambil hadiah!",
      addedPoints: mission.reward_points,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { username, age, avatar_url } = req.body;
  if (!username || !age || !avatar_url)
    return res.status(400).json({ message: "Semua data harus diisi!" });

  try {
    await db.query(
      "UPDATE users SET username = ?, age = ?, avatar_url = ? WHERE id = ?",
      [username, age, avatar_url, userId],
    );
    res.json({ message: "Profil berhasil diperbarui!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAvatars = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM avatars");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getCharacters,
  updateActiveCharacter,
  getUserProfile,
  getLeaderboard,
  getMissions,
  claimMission,
  updateUserProfile,
  getAvatars,
};
