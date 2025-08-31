const express = require("express");
const router = express.Router();

const Result = require("../models/Result");
const Student = require("../models/Student");
const Course = require("../models/Course");

// GET /results → list all results
router.get("/", async (req, res) => {
  try {
    const results = await Result.find()
      .populate("student", "name")
      .populate("course", "name");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /results → add new result
router.post("/", async (req, res) => {
  try {
    const { studentId, courseId, marks, grade } = req.body;

    const result = new Result({
      student: studentId,
      course: courseId,
      marks,
      grade,
    });

    await result.save();
    await result.populate("student", "name").populate("course", "name");

    res.json({ message: "Result added", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /results/:id → update result
router.put("/:id", async (req, res) => {
  try {
    const { studentId, courseId, marks, grade } = req.body;

    const updated = await Result.findByIdAndUpdate(
      req.params.id,
      { student: studentId, course: courseId, marks, grade },
      { new: true, runValidators: true }
    ).populate("student", "name").populate("course", "name");

    if (!updated) return res.status(404).json({ error: "Result not found" });

    res.json({ message: "Result updated", result: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
