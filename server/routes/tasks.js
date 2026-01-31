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

// ✅ ADD new task
router.post("/", authMiddleware, async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Task title is required" });
  }

  try {
    const newTask = await Task.create({
      title,
      description,
      user: req.userId,
      status: "pending"
    });

    res.json({
      message: "Task added successfully",
      task: newTask
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to add task" });
  }
});

// ✅ MARK TASK AS COMPLETED
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { status: "completed" },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to mark task as completed" });
  }
});

// ✅ DELETE ALL TASKS FOR LOGGED-IN USER
router.delete("/", authMiddleware, async (req, res) => {
  try {
    await Task.deleteMany({ user: req.userId });
    res.json({ message: "All tasks deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete tasks" });
  }
});

module.exports = router;
