const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// --------------------
// REGISTER
// --------------------
router.post(
  "/register",
  [
    // Full Name: letters and spaces only
    body("fullName")
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("Full name must contain only letters and spaces")
      .isLength({ min: 3 })
      .withMessage("Full name must be at least 3 characters"),

    // ID Number: exactly 13 digits
    body("idNumber")
      .isNumeric()
      .withMessage("ID Number must be numeric")
      .isLength({ min: 13, max: 13 })
      .withMessage("ID Number must be exactly 13 digits"),

    // Account Number: numeric, 8-12 digits
    body("accountNumber")
      .isNumeric()
      .withMessage("Account Number must be numeric")
      .isLength({ min: 8, max: 12 })
      .withMessage("Account Number must be 8-12 digits"),

    // Password: strong
    body("password")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0
      })
      .withMessage(
        "Password must have at least 8 characters, include uppercase, lowercase, and number"
      )
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors on registration:", errors.array());
      console.log("Request body:", req.body);
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, idNumber, accountNumber, password } = req.body;

    try {
      console.log("Register request body:", req.body);

      let customer = await Customer.findOne({ accountNumber });
      if (customer) {
        console.log("Customer already exists:", accountNumber);
        return res.status(400).json({ msg: "Customer already exists" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create customer
      customer = new Customer({
        fullName,
        idNumber,
        accountNumber,
        password: hashedPassword
      });
      await customer.save();

      // Generate JWT token
      const payload = { customer: { id: customer.id } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

      console.log("Customer registered successfully:", accountNumber);
      console.log("JWT token generated:", token);

      res.json({ token });
    } catch (err) {
      console.error("Server error during registration:", err.message);
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

// --------------------
// LOGIN
// --------------------
router.post(
  "/login",
  [
    body("accountNumber")
      .isNumeric()
      .withMessage("Account Number must be numeric"),
    body("password")
      .exists()
      .withMessage("Password is required")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors on login:", errors.array());
      console.log("Request body:", req.body);
      return res.status(400).json({ errors: errors.array() });
    }

    const { accountNumber, password } = req.body;

    try {
      console.log("Login request body:", req.body);

      const customer = await Customer.findOne({ accountNumber });
      if (!customer) {
        console.log("Login failed: customer not found");
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, customer.password);
      if (!isMatch) {
        console.log("Login failed: password mismatch for account", accountNumber);
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      const payload = { customer: { id: customer.id } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

      console.log("Login successful for account:", accountNumber);
      console.log("JWT token generated:", token);

      res.json({ token });
    } catch (err) {
      console.error("Server error during login:", err.message);
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
