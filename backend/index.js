
import cors from "cors"; // jika belum, jalankan: npm install cors
app.use(cors({
  origin: "https://tiket-kalikesek.vercel.app", // URL frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Koneksi database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tiket_wisata"
});

// Endpoint pemesanan
app.get("/api/pemesanan", (req, res) => {
  const { wahana, tanggal_awal, tanggal_akhir } = req.query;

  let query = `
    SELECT p.*, w.harga AS harga_wahana
    FROM pemesanan p
    JOIN wahana w ON p.nama_wahana = w.nama
  `;
  const params = [];

  const filters = [];

  if (wahana) {
    filters.push("p.nama_wahana = ?");
    params.push(wahana);
  }

  if (tanggal_awal && tanggal_akhir) {
    filters.push("DATE(p.tanggal_pesan) BETWEEN ? AND ?");
    params.push(tanggal_awal, tanggal_akhir);
  }

  if (filters.length > 0) {
    query += " WHERE " + filters.join(" AND ");
  }

  query += " ORDER BY p.tanggal_pesan DESC";

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Gagal mengambil data:", err);
      return res.status(500).json({ message: "Gagal ambil data pemesanan" });
    }
    res.json(results);
  });
});

// Endpoint daftar wahana
app.get("/api/wahana", (req, res) => {
  db.query("SELECT * FROM wahana", (err, results) => {
    if (err) {
      console.error("Gagal ambil data wahana:", err);
      return res.status(500).json({ message: "Gagal ambil data wahana" });
    }
    res.json(results);
  });
});

// Endpoint untuk menyimpan pemesanan baru
app.post("/api/pemesanan", (req, res) => {
  const { nama, jumlah, metode, wahana } = req.body;

  if (!nama || !jumlah || !metode || !wahana) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  const sql = `
    INSERT INTO pemesanan (nama_pemesan, jumlah_tiket, metode_pembayaran, nama_wahana, tanggal_pesan)
    VALUES (?, ?, ?, ?, NOW())
  `;
  const values = [nama, jumlah, metode, wahana];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Gagal menyimpan data pemesanan:", err);
      return res.status(500).json({ message: "Gagal simpan pemesanan" });
    }

    res.status(201).json({ message: "Pemesanan berhasil", id: result.insertId });
  });
});


// Jalankan server
app.listen(3001, () => {
  console.log("Server berjalan di http://localhost:3001");
});
