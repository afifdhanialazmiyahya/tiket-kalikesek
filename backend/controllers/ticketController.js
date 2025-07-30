// backend/controllers/ticketController.js
const db = require('../db');

exports.createOrder = (req, res) => {
  const { namaPemesan, jumlah, wahana, status, petugas } = req.body;
  const sql = 'INSERT INTO tiket (nama_pemesan, jumlah, wahana, status, petugas) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [namaPemesan, jumlah, wahana, status, petugas], (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(201).json({ message: 'Tiket berhasil dipesan', id: result.insertId });
  });
};

exports.getAllOrders = (_, res) => {
  db.query('SELECT * FROM tiket ORDER BY created_at DESC', (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(result);
  });
};

exports.filterOrders = (req, res) => {
  const { wahana, dari, sampai } = req.query;
  let sql = 'SELECT * FROM tiket WHERE 1=1';
  const params = [];

  if (wahana) {
    sql += ' AND wahana = ?';
    params.push(wahana);
  }
  if (dari && sampai) {
    sql += ' AND created_at BETWEEN ? AND ?';
    params.push(dari, sampai);
  }

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(result);
  });
};
