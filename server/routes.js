const express = require("express");
const router = express.Router();

// Temporary in-memory array to store courses
let courses = [];

// Get all courses
router.get("/courses", (req, res) => {
  res.json(courses);
});

// Add a new course
router.post("/courses", (req, res) => {
  const { name, credits, instructor } = req.body;
  const newCourse = { id: courses.length + 1, name, credits, instructor };
  courses.push(newCourse);
  res.json({ message: "Course added successfully", course: newCourse });

  
});

module.exports = router;
