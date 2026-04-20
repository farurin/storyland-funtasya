const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Akses ditolak. Silakan login." });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res
      .status(400)
      .json({ message: "Token tidak valid atau sudah kedaluwarsa." });
  }
};

// Middleware role-based
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({ message: "Akses ditolak! Role tidak ditemukan." });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Akses ditolak! Anda tidak memiliki izin untuk tindakan ini.",
      });
    }

    next();
  };
};

module.exports = { verifyToken, authorizeRoles, JWT_SECRET };
