const express = require("express");
const router = express.Router();
const Flashcard = require("../models/Flashcard");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// 🔐 Protect all flashcard routes
router.use(authMiddleware);

// GET /api/flashcards
// Optional query: ?subject=DBMS
router.get("/", async (req, res) => {
  try {
    const userId = req.userId;
    const { subject } = req.query;

    const user = await User.findById(userId).select("name");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ filter by user + optional subject
    const filter = { user_id: userId };

    if (subject && subject !== "All") {
      filter.subject = subject;
    }

    const flashcards = await Flashcard.find(filter)
      .select("question answer subject");

    res.json({
      username: user.name,
      flashcards,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/flashcards
router.post("/", async (req, res) => {
  try {
    const { question, answer, subject } = req.body;
    const userId = req.userId;

    if (!question || !answer) {
      return res.status(400).json({ error: "Question and answer required" });
    }

    const newCard = new Flashcard({
      user_id: userId,
      question,
      answer,
      subject: subject || "General", // ✅ default
    });

    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
