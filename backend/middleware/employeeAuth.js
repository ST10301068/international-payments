const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ msg: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employee = await Employee.findById(decoded.id).select("-password");
    if (!employee) return res.status(401).json({ msg: "Unauthorized" });
    req.user = employee;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

const requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role)
    return res.status(403).json({ msg: "Forbidden: insufficient permissions" });
  next();
};

// ✅ Make sure you export both
module.exports = { verifyToken, requireRole };
