const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middlewares/authMiddleware");
const { recordUserActivity } = require("../utils/activityHelper");

const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0)
          return res.status(400).json({ message: "Email sudah terdaftar!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const username = email.split("@")[0];

        const insertSql =
          "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        db.query(
          insertSql,
          [username, email, hashedPassword],
          (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET, {
              expiresIn: "1d",
            });
            recordUserActivity(result.insertId);

            res.status(201).json({
              message: "Pendaftaran sukses!",
              token,
              user: { id: result.insertId, username, email },
            });
          },
        );
      },
    );
  } catch (error) {
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(401).json({ message: "Email atau password salah!" });

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Email atau password salah!" });

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "1d",
      });
      recordUserActivity(user.id);

      res.json({
        message: "Login sukses!",
        token,
        user: { id: user.id, username: user.username, email: user.email },
      });
    },
  );
};

module.exports = { register, login };
