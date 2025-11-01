const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["employee", "superadmin"],
    default: "employee"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Employee", EmployeeSchema);
