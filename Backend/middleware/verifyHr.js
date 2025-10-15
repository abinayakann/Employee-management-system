const jwt = require("jsonwebtoken");


const verifyHr = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ normalize role check to avoid case mismatch
    if (decoded.role.toLowerCase() !== "hr") {
      return res.status(403).json({ message: "Access denied. HR only." });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token." });
  }
};
module.exports = verifyHr