const express = require("express");
const auth = require("../middleware/authMiddleware");
const Payment = require("../models/Payment");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// --------------------
// CREATE PAYMENT
// --------------------
router.post(
  "/",
  auth,
  [
    body("amount")
      .isFloat({ min: 0.01 })
      .withMessage("Amount must be a positive number"),

   body("currency")
  .matches(/^[A-Z]{3}$/)
  .isIn(["USD", "EUR", "ZAR"])
  .withMessage("Currency must be one of: USD, EUR, ZAR"),

    body("provider")
      .matches(/^SWIFT$/)
      .withMessage("Provider must be SWIFT"),

    body("recipientAccount")
      .isNumeric()
      .withMessage("Recipient account must be numeric"),

    body("swiftCode")
      .matches(/^[A-Z0-9]{8,11}$/)
      .withMessage("Invalid SWIFT code")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { amount, currency, provider, recipientAccount, swiftCode } = req.body;

    try {
      const payment = new Payment({
        customerId: req.customer.id,
        amount,
        currency,
        provider,
        recipientAccount,
        swiftCode,
        status: "pending" // default for Part 3
      });

      await payment.save();
      res.json(payment);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// --------------------
// GET CUSTOMER PAYMENTS
// --------------------
router.get("/", auth, async (req, res) => {
  try {
    const payments = await Payment.find({ customerId: req.customer.id });
    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
