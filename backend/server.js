// --------------------
// server.js
// --------------------
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // only for local dev HTTPS

const fs = require("fs");
const https = require("https");
const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss");

// Load environment variables FIRST
dotenv.config();

const connectDB = require("./config/db");

// --------------------
// MAIN IIFE: connect DB then start server
// --------------------
(async () => {
  try {
    // Connect to MongoDB and WAIT for it
    await connectDB();
    
    // Wait for mongoose to be fully ready
    const mongoose = require("mongoose");
    if (mongoose.connection.readyState !== 1) {
      console.log("Waiting for MongoDB connection to be ready...");
      await new Promise((resolve) => {
        mongoose.connection.once("open", resolve);
      });
    }
    console.log("MongoDB connection ready, state:", mongoose.connection.readyState);

    // NOW require models (this ensures they're registered with the connected mongoose instance)
    require("./models/Employee");
    require("./models/Payment");
    console.log("✅ Models loaded");

    // Seed superadmin if needed
    const seedSuperadmin = require("./utils/seedSuperadmin");
    if (process.env.SEED_SUPERADMIN === "true" && process.env.NODE_ENV !== "production") {
      await seedSuperadmin();
      console.log("✅ Superadmin seeded (or already exists)");
    }

    const app = express();

    // --------------------
    // SECURITY MIDDLEWARE
    // --------------------
    app.use(helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
    }));

    // Rate limiter
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100
    });
    app.use(limiter);

    app.get("/", (req, res) => {
    res.send("✅ API is running — use /api/... endpoints.");
    });


    // CORS
   app.use(cors({
  origin: [
    "http://localhost:3000",  // React dev server (HTTP)
    "https://localhost:5173", // other portal
    "https://localhost:3000"  // if you ever use HTTPS
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

    // Body parser
    app.use(express.json({ limit: "10kb" }));

    // --------------------
    // INPUT SANITIZATION
    // --------------------
    app.use((req, res, next) => {
      req.body = mongoSanitize.sanitize(req.body, { replaceWith: "_" });
      next();
    });

    app.use((req, res, next) => {
      for (let key in req.body) {
        if (typeof req.body[key] === "string") {
          req.body[key] = xss(req.body[key]);
        }
      }
      next();
    });

    // --------------------
    // ROUTES (require AFTER models are loaded)
    // --------------------
    console.log("Loading routes...");
    app.use("/api/employee", require("./routes/employeeRoutes"));
    app.use("/api/admin", require("./routes/adminRoutes"));
    app.use("/api/auth", require("./routes/auth"));
    app.use("/api/payments", require("./routes/payments"));
    console.log("✅ Routes loaded");

    // --------------------
    // CENTRAL ERROR HANDLER
    // --------------------
    app.use((err, req, res, next) => {
      console.error("Error caught by handler:", err);
      res.status(500).json({ msg: "Server Error" });
    });

    // --------------------
    // HTTPS SERVER SETUP
    // --------------------
    const PORT = process.env.PORT || 5000;
    const options = {
      key: fs.readFileSync("./localhost-key.pem"),
      cert: fs.readFileSync("./localhost.pem")
    };

    https.createServer(options, app).listen(PORT, () => {
      console.log(`✅ HTTPS Server running on https://localhost:${PORT}`);
      console.log("📡 API endpoints:");
      console.log(" - /api/employee/login");
      console.log(" - /api/admin/...");
      console.log(" - /api/auth/...");
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();