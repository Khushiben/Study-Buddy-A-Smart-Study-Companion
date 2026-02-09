const express = require("express");
const router = express.Router();
const Deadline = require("../models/Deadline"); // model already exists
const protect = require("../middleware/authMiddleware");

/*
|--------------------------------------------------------------------------
| ADD DEADLINE  (Equivalent to AJAX POST in PHP)
| POST /api/deadlines
|--------------------------------------------------------------------------
*/
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, deadlineDate } = req.body;

    if (!title || !deadlineDate) {
      return res.status(400).json({
        status: "error",
        message: "Title and date required"
      });
    }

    await Deadline.create({
      userId: req.user.id,
      title,
      description,
      deadlineDate
    });

    res.json({ status: "success" });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
});

/*
|--------------------------------------------------------------------------
| FETCH ALL DEADLINES (For FullCalendar)
| GET /api/deadlines
|--------------------------------------------------------------------------
*/
router.get("/", protect, async (req, res) => {
  try {
    const deadlines = await Deadline.find({ userId: req.user.id });

    // Match FullCalendar JSON structure used in PHP
    const events = deadlines.map(d => ({
      id: d._id,
      title: d.title,
      start: d.deadlineDate,
      description: d.description
    }));

    res.json(events);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
});

/*
|--------------------------------------------------------------------------
| FETCH UPCOMING DEADLINES (Next 7 Days)
| GET /api/deadlines/upcoming
|--------------------------------------------------------------------------
*/
router.get("/upcoming", protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekFromNow = new Date();
    weekFromNow.setDate(today.getDate() + 7);

    const deadlines = await Deadline.find({
      userId: req.user.id,
      deadlineDate: {
        $gte: today,
        $lte: weekFromNow
      }
    }).sort({ deadlineDate: 1 });

    res.json(deadlines);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
});

module.exports = router;
