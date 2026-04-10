const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "funtasya_storyland",
});

db.connect((err) => {
  if (err) {
    console.error("Gagal terkoneksi ke MySQL Laragon:", err);
    return;
  }
  console.log("Berhasil terkoneksi ke database funtasya_storyland!");
});

module.exports = db;
