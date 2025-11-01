const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    idNumber: { type: String, required: true, unique: true },
    accountNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model("Customer", CustomerSchema);

