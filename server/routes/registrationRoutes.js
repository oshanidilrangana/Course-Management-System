const express = require("express");
const router = express.Router();

const Registration = require("../models/Registration");
const Student = require("../models/Student");
const Course = require("../models/Course");

// GET /registrations → list all registrations
router.get("/", async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate({
        path: 'student',
        select: 'name email studentId',
        options: { lean: true }
      })
      .populate("course", "name credits"); // get course name & credits
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /registrations → add new registration
router.post("/", async (req, res) => {
  try {
    const { studentId, courseId, semester } = req.body;

    const registration = new Registration({
      student: studentId,
      course: courseId,
      semester,
    });

    await registration.save();

    // Populate student & course fields with studentId included
    await registration.populate({
      path: 'student',
      select: 'name email studentId',
      options: { lean: true }
    }).populate("course", "name credits");

    res.json({ message: "Registration added", registration });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
