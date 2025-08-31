const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: { 
      type: String, 
      unique: true,
      trim: true 
    },
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true 
    },
    department: { 
      type: String, 
      required: true, 
      trim: true 
    },
  },
  { timestamps: true }
);

// Pre-save middleware to generate student ID
studentSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      // Find the highest student ID
      const lastStudent = await this.constructor.findOne(
        { studentId: { $regex: /^TEC-\d+$/ } },
        { studentId: 1 },
        { sort: { studentId: -1 } }
      );
      
      // Generate new ID
      let nextNumber = 1;
      if (lastStudent && lastStudent.studentId) {
        const lastNumber = parseInt(lastStudent.studentId.split('-')[1], 10);
        nextNumber = lastNumber + 1;
      }
      
      // Format the ID with leading zeros
      this.studentId = `TEC-${String(nextNumber).padStart(3, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model("Student", studentSchema);
