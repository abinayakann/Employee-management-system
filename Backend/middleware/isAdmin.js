// middleware/isAdmin.js
// Replace with your actual auth user retrieval
module.exports = function isAdmin(req, res, next) {
  // assume req.user set by auth middleware (jwt)
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (!req.user.isAdmin) return res.status(403).json({ message: "Admins only" });
  next();
};
