// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    console.log("TOKEN NOT PROVIDED");
    return res.status(401).json({ message: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get fresh user data including role
    const user = await User.findById(decoded.id).select("_id username email");
    if (!user) {
      console.log("USER NOT FOUND");
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // Store full user object with role
    req.userId = user._id;
    
    next();
  } catch(error) {
    console.log("JWT Error:", error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(401).json({ message: "Authentication failed" });
  }
};