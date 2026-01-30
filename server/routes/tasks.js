const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ✅ GET all tasks for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});


// ✅ ADD new task (stored in MongoDB with userId)
router.post("/", authMiddleware, async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Task title is required" });
  }

  try {
    const newTask = await Task.create({
      title,
      description,
      user: req.userId
    });

    res.json({
      message: "Task added successfully",
      task: newTask
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to add task" });
  }
});

module.exports = router;
