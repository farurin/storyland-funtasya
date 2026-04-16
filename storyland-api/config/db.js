const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10, // Maksimal 10 koneksi bersamaan
  queueLimit: 0,
});

// Tes koneksi di awal
const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log("Berhasil terkoneksi ke Database Cloud (Aiven)!");
    connection.release(); // Kembalikan koneksi ke kolam setelah dites
  } catch (err) {
    console.error("Gagal terkoneksi ke Database Aiven:", err.message);
  }
};

testConnection();

module.exports = db;
