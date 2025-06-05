const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const dbPath = path.resolve(__dirname, "../db/community.sqlite");

// GET all addresses
router.get("/", authMiddleware, (req, res) => {
  const db = new sqlite3.Database(dbPath);
  db.all("SELECT * FROM address", [], (err, rows) => {
    db.close();
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// CREATE address
router.post("/", authMiddleware, (req, res) => {
  const { full_address, rt, rw, village, district, city, postal_code } = req.body;
  const db = new sqlite3.Database(dbPath);
  db.run(
    `INSERT INTO address (full_address, rt, rw, village, district, city, postal_code)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [full_address, rt, rw, village, district, city, postal_code],
    function (err) {
      db.close();
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

module.exports = router;
