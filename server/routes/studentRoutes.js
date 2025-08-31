const express = require("express");
const router = express.Router();
const Student = require("../models/Student"); // Note: Make sure the file name matches exactly (case-sensitive)

// GET /students — list all
router.get("/", async (req, res) => {
  try {
    const students = await Student.find({}, 'studentId name email department')
      .sort({ studentId: 1 });
    res.json(students);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /students — add new
router.post("/", async (req, res) => {
  try {
    const { name, email, department } = req.body;
    const student = new Student({ name, email, department });
    await student.save();
    
    // Fetch the saved student to get the generated studentId
    const savedStudent = await Student.findById(student._id, 'studentId name email department');
    
    res.status(201).json({
      message: "Student added successfully",
      student: savedStudent
    });
  } catch (e) {
    res.status(400).json({ 
      error: e.message,
      message: "Failed to add student. Please check the provided data."
    });
  }
});

// PUT /students/:id — update
router.put("/:id", async (req, res) => {
  try {
    const { name, email, department } = req.body;
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      { name, email, department },
      { 
        new: true, 
        runValidators: true,
        select: 'studentId name email department' // Only return these fields
      }
    );
    
    if (!updated) {
      return res.status(404).json({ 
        error: "Student not found",
        message: "The requested student could not be found."
      });
    }
    
    res.json({ 
      message: "Student updated successfully", 
      student: updated 
    });
  } catch (e) {
    res.status(400).json({ 
      error: e.message,
      message: "Failed to update student. Please check the provided data."
    });
  }
});

// DELETE /students/:id — delete
router.delete("/:id", async (req, res) => {
  try {
    const removed = await Student.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
