const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");
const Payment = require("../models/Payment"); // your Part 2 Payment model
const { verifyToken, requireRole } = require("../middleware/employeeAuth");

// ----- LOGIN -----
// ----- LOGIN -----
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Login request received:", req.body);

  if (!username || !password)
    return res.status(400).json({ msg: "Missing fields" });

  try {
    const employee = await Employee.findOne({ username });
    console.log("Employee found:", employee);

    if (!employee)
      return res.status(401).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, employee.password);
    console.log("Password match:", isMatch);

    if (!isMatch)
      return res.status(401).json({ msg: "Invalid credentials" });

    console.log("JWT_SECRET value:", process.env.JWT_SECRET);

    const token = jwt.sign(
      { id: employee._id, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: {
        username: employee.username,
        fullName: employee.fullName,
        role: employee.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


// ----- VIEW PENDING PAYMENTS -----
// ----- VIEW PENDING PAYMENTS -----
router.get("/payments/pending", verifyToken, requireRole("employee"), async (req, res) => {
  try {
    console.log("Fetching pending payments...");
    const payments = await Payment.find({ status: { $regex: /^pending$/i } });
    console.log(`Found ${payments.length} pending payments`);
    res.json(payments);
  } catch (err) {
    console.error("Error fetching pending payments:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ----- APPROVE/DENY PAYMENT -----
router.put("/payments/:id", verifyToken, requireRole("employee"), async (req, res) => {
  const { status } = req.body;
  if (!["Approved", "Denied"].includes(status)) return res.status(400).json({ msg: "Invalid status" });

  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ msg: "Payment not found" });
    if (payment.status.toLowerCase() !== "pending") return res.status(400).json({ msg: "Payment already processed" });


    payment.status = status;
    payment.processedBy = req.user.username;
    payment.processedAt = new Date();
    await payment.save();

    res.json({ msg: `Payment ${status.toLowerCase()} successfully`, payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ----- PAYMENT HISTORY -----
router.get("/payments/history", verifyToken, requireRole("employee"), async (req, res) => {
  try {
    const payments = await Payment.find({ status: { $in: ["Approved", "Denied"] } });
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
