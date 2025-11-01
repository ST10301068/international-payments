const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Employee = require("../models/Employee");
const { verifyToken, requireRole } = require("../middleware/employeeAuth");

// ----- VIEW EMPLOYEES -----
router.get("/employees", verifyToken, requireRole("superadmin"), async (req, res) => {
  try {
    const employees = await Employee.find({ role: "employee" }).select("-password");
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ----- CREATE EMPLOYEE -----
router.post("/employees", verifyToken, requireRole("superadmin"), async (req, res) => {
  const { username, fullName, password } = req.body;
  if (!username || !fullName || !password) return res.status(400).json({ msg: "Missing fields" });

  try {
    const exists = await Employee.findOne({ username });
    if (exists) return res.status(400).json({ msg: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
    const employee = new Employee({ username, fullName, password: hashedPassword });
    await employee.save();

    res.json({ msg: "Employee created successfully", employee: { username, fullName, role: employee.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ----- DELETE EMPLOYEE -----
router.delete("/employees/:id", verifyToken, requireRole("superadmin"), async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ msg: "Employee not found" });
    if (employee.role === "superadmin") return res.status(403).json({ msg: "Cannot delete superadmin" });

    await Employee.findByIdAndDelete(req.params.id);
    res.json({ msg: "Employee deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
