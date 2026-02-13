const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// CREATE NOTE (text + file)
// userId is obtained from token via authMiddleware
router.post("/", authMiddleware, upload.single("noteFile"), async (req, res) => {
  try {
    const { subject, content } = req.body;
    const userId = req.userId;                        // set by middleware

    const newNote = new Note({
      userId,
      subject,
      content,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
      fileName: req.file ? req.file.originalname : null,
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: "Failed to save note" });
  }
});

// GET USER NOTES
// no parameter; use authenticated user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// DELETE ALL NOTES for authenticated user
router.delete("/", authMiddleware, async (req, res) => {
  try {
    await Note.deleteMany({ userId: req.userId });
    res.json({ message: "All notes deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete notes" });
  }
});

module.exports = router;