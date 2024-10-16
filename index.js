const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

// Koneksi ke MySQL database
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crud_db'
});

// Connect ke database
conn.connect((err) => {
  if (err) throw err;
  console.log('Koneksi berhasil');
});

app.use(bodyParser.json());
app.listen(8000, () => console.log('Server berjalan di port 8000'));
app.use(express.static('public'));

// Baca Semua Data Barang
app.get('/read-barang', (req, res) => {
  let sql = "SELECT *, DATE_FORMAT(dtCreate, '%Y-%m-%d %H:%i:%s') as dtCreate, DATE_FORMAT(dtChange, '%Y-%m-%d %H:%i:%s') as dtChange FROM barang";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    results.forEach((result) => {
      result.dtChange = new Date(result.dtChange).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    });
    res.json(results);
  });
});

// Baca Data Barang Berdasarkan Kode Barang
app.get('/read-barangbyno/:kdBarang', (req, res) => {
  const kdBarang = req.params.kdBarang;
  let sql = `SELECT * FROM barang WHERE kdBarang = '${kdBarang}'`;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Insert atau Update Data Barang
app.post('/api-barang', (req, res) => {
  const action = req.body.action;
  const data = {
    kdBarang: req.body.kdBarang,
    namaBarang: req.body.namaBarang,
    qty: req.body.qty,
    price: req.body.price,
    dtCreate: new Date(),
    dtChange: new Date()
  };
  let sql;

  if (action === 'Simpan') {
    sql = "INSERT INTO barang SET ?";
  } else {
    sql = `
      UPDATE barang SET 
      namaBarang = '${req.body.namaBarang}', 
      qty = ${req.body.qty}, 
      price = ${req.body.price}, 
      dtChange = NOW() 
      WHERE kdBarang = '${req.body.kdBarang}'
    `;
  }

  let query = conn.query(sql, data, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Hapus Data Barang Berdasarkan Kode Barang
app.get('/hapus-barang/:kdBarang', (req, res) => {
  const kdBarang = req.params.kdBarang;
  
  // Debugging untuk mengecek kode barang
  console.log(`Kode Barang yang dihapus: ${kdBarang}`);
  
  let sql = `DELETE FROM barang WHERE kdBarang = '${kdBarang}'`;
  
  let query = conn.query(sql, (err, results) => {
    if (err) {
      // Untuk log error jika terjadi kesalahan
      console.error(err); 
      res.status(500).send('Terjadi kesalahan saat menghapus data.');
    } else {
      console.log(results); // Debugging untuk melihat hasil query
      if (results.affectedRows > 0) {
        res.json({ message: 'Data berhasil dihapus' });
      } else {
        res.json({ message: 'Data tidak ditemukan' });
      }
    }
  });
});