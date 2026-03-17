const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const Flashcard = require("../models/Flashcard");
const Note = require("../models/Note");
const Deadline = require("../models/Deadline");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/progress", authMiddleware, async (req, res) => {
  try {

    const userId = req.userId;

    // Tasks
    const totalTasks = await Task.countDocuments({ user: userId });
    const completedTasks = await Task.countDocuments({
      user: userId,
      status: "completed"
    });

    const taskProgress =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    // Flashcards
    const flashcards = await Flashcard.countDocuments({
      user_id: userId
    });

    // Notes
    const notes = await Note.countDocuments({
      userId: userId
    });

    // Upcoming Deadlines
    const deadlines = await Deadline.countDocuments({
      userId: userId,
      deadlineDate: { $gte: new Date() }
    });

    // Productivity Score
    const flashcardScore = Math.min((flashcards / 50) * 100, 100);
    const notesScore = Math.min((notes / 20) * 100, 100);

    const productivityScore = Math.round(
      taskProgress * 0.5 +
      flashcardScore * 0.3 +
      notesScore * 0.2
    );

    res.json({
      totalTasks,
      completedTasks,
      taskProgress,
      flashcards,
      notes,
      deadlines,
      productivityScore
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;