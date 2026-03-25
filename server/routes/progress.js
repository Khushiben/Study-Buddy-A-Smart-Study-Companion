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
    const now = new Date();

    const weekStart = new Date();
    weekStart.setDate(now.getDate() - 7);

    const monthStart = new Date();
    monthStart.setMonth(now.getMonth() - 1);

    const yearStart = new Date();
    yearStart.setFullYear(now.getFullYear() - 1);

    // Tasks
    const totalTasks = await Task.countDocuments({ user: userId });

    const completedTasks = await Task.countDocuments({
      user: userId,
      status: "completed"
    });

    const weeklyTasks = await Task.countDocuments({
      user: userId,
      createdAt: { $gte: weekStart }
    });

    const monthlyTasks = await Task.countDocuments({
      user: userId,
      createdAt: { $gte: monthStart }
    });

    const yearlyTasks = await Task.countDocuments({
      user: userId,
      createdAt: { $gte: yearStart }
    });

    const taskProgress =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    // Flashcards
    const flashcards = await Flashcard.countDocuments({
      user_id: userId
    });

    // Notes
    const notes = await Note.countDocuments({
      userId
    });

    // Deadlines
    const deadlines = await Deadline.countDocuments({
      userId,
      deadlineDate: { $gte: new Date() }
    });

    // Productivity
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
      productivityScore,
      weeklyTasks,
      monthlyTasks,
      yearlyTasks
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;