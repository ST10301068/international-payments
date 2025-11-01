const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");

const seedSuperadmin = async () => {
  if (process.env.SEED_SUPERADMIN !== "true") return;

  try {
    // DON'T create a new connection - use the existing one from server.js
    const existing = await Employee.findOne({ username: process.env.SUPERADMIN_USERNAME });
    if (existing) {
      console.log("Superadmin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      process.env.SUPERADMIN_PASSWORD,
      parseInt(process.env.BCRYPT_SALT_ROUNDS)
    );

    const superadmin = new Employee({
      username: process.env.SUPERADMIN_USERNAME,
      fullName: process.env.SUPERADMIN_FULLNAME,
      password: hashedPassword,
      role: "superadmin"
    });

    await superadmin.save();
    console.log("✅ Superadmin created successfully!");
  } catch (err) {
    console.error("❌ Error creating superadmin:", err);
    throw err; // Re-throw so server.js knows there was an error
  }
  // DON'T disconnect - let server.js manage the connection lifecycle
};

module.exports = seedSuperadmin;