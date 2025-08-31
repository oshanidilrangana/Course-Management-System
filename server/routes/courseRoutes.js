const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new course
router.post("/", async (req, res) => {
  try {
    const { name, credits, instructor } = req.body;
    const newCourse = new Course({ name, credits, instructor });
    await newCourse.save();
    res.status(201).json({ message: "Course added successfully", course: newCourse });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a course
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, credits, instructor } = req.body;
    
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { name, credits, instructor },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ message: "Course updated successfully", course: updatedCourse });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a course
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
