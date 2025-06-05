const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const dbPath = path.resolve(__dirname, "../db/community.sqlite");

// GET all residents
router.get("/", authMiddleware, (req, res) => {
  const db = new sqlite3.Database(dbPath);
  const sql = `
    SELECT r.*, a.full_address
    FROM residents r
    LEFT JOIN address a ON r.address_id = a.id
  `;
  db.all(sql, [], (err, rows) => {
    db.close();
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET resident by ID
router.get("/:id", authMiddleware, (req, res) => {
  const db = new sqlite3.Database(dbPath);
  const sql = `SELECT * FROM residents WHERE id = ?`;
  db.get(sql, [req.params.id], (err, row) => {
    db.close();
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// CREATE resident
router.post("/", authMiddleware, (req, res) => {
  const {
    full_name, nik, gender, birthplace, birthdate, blood_type, age, religion,
    marital_status, relationship, education, occupation, citizenship, address_id
  } = req.body;

  const db = new sqlite3.Database(dbPath);
  const sql = `
    INSERT INTO residents (
      full_name, nik, gender, birthplace, birthdate, blood_type, age, religion,
      marital_status, relationship, education, occupation, citizenship, address_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(sql, [
    full_name, nik, gender, birthplace, birthdate, blood_type, age, religion,
    marital_status, relationship, education, occupation, citizenship, address_id
  ], function (err) {
    db.close();
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
});

// UPDATE resident
router.put("/:id", authMiddleware, (req, res) => {
  const {
    full_name, nik, gender, birthplace, birthdate, blood_type, age, religion,
    marital_status, relationship, education, occupation, citizenship, address_id
  } = req.body;

  const db = new sqlite3.Database(dbPath);
  const sql = `
    UPDATE residents SET
      full_name = ?, nik = ?, gender = ?, birthplace = ?, birthdate = ?, blood_type = ?, age = ?, religion = ?,
      marital_status = ?, relationship = ?, education = ?, occupation = ?, citizenship = ?, address_id = ?
    WHERE id = ?
  `;
  db.run(sql, [
    full_name, nik, gender, birthplace, birthdate, blood_type, age, religion,
    marital_status, relationship, education, occupation, citizenship, address_id, req.params.id
  ], function (err) {
    db.close();
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Resident updated" });
  });
});

// DELETE resident
router.delete("/:id", authMiddleware, (req, res) => {
  const db = new sqlite3.Database(dbPath);
  db.run("DELETE FROM residents WHERE id = ?", [req.params.id], function (err) {
    db.close();
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).end();
  });
});

module.exports = router;
