// middleware/auth.js
const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access only" });
  next();
};

exports.isHR = (req, res, next) => {
  if (req.user.role !== "hr") return res.status(403).json({ message: "HR access only" });
  next();
};

exports.isEmployee = (req, res, next) => {
  if (req.user.role !== "employee") return res.status(403).json({ message: "Employee access only" });
  next();
};
