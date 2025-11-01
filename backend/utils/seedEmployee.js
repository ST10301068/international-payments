const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const Employee = require("../models/Employee");

dotenv.config();

async function seedEmployee() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const existing = await Employee.findOne({ username: "employee1" });
    if (existing) {
      console.log("Employee already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Employee123!", 10);
    const employee = new Employee({
      fullName: "John Doe",
      username: "employee1",
      password: hashedPassword,
      role: "employee",
    });

    await employee.save();
    console.log("✅ Employee created successfully");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding employee:", err);
    process.exit(1);
  }
}

seedEmployee();
