const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const dbPath = path.resolve(__dirname, "../db/community.sqlite");

// GET all households with address info
router.get("/", authMiddleware, (req, res) => {
  const db = new sqlite3.Database(dbPath);
  const sql = `
    SELECT h.*, a.full_address
    FROM households h
    LEFT JOIN address a ON h.address_id = a.id
  `;
  db.all(sql, [], (err, rows) => {
    db.close();
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET a single household by KK number
router.get("/:kk_number", authMiddleware, (req, res) => {
  const db = new sqlite3.Database(dbPath);
  const sql = `
    SELECT h.*, a.full_address
    FROM households h
    LEFT JOIN address a ON h.address_id = a.id
    WHERE h.kk_number = ?
  `;
  db.get(sql, [req.params.kk_number], (err, row) => {
    db.close();
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Household not found" });
    res.json(row);
  });
});

// CREATE a new household
router.post("/", authMiddleware, (req, res) => {
  const { kk_number, status, address_id } = req.body;
  const db = new sqlite3.Database(dbPath);
  const sql = `
    INSERT INTO households (kk_number, status, address_id)
    VALUES (?, ?, ?)
  `;
  db.run(sql, [kk_number, status, address_id], function (err) {
    db.close();
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Household created" });
  });
});

// UPDATE household by KK number
router.put("/:kk_number", authMiddleware, (req, res) => {
  const { status, address_id } = req.body;
  const db = new sqlite3.Database(dbPath);
  const sql = `
    UPDATE households
    SET status = ?, address_id = ?
    WHERE kk_number = ?
  `;
  db.run(sql, [status, address_id, req.params.kk_number], function (err) {
    db.close();
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Household updated" });
  });
});

// DELETE household by KK number
router.delete("/:kk_number", authMiddleware, (req, res) => {
  const db = new sqlite3.Database(dbPath);
  const sql = `DELETE FROM households WHERE kk_number = ?`;
  db.run(sql, [req.params.kk_number], function (err) {
    db.close();
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).end();
  });
});

module.exports = router;
