const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    marks: { type: Number, required: true },
    grade: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
