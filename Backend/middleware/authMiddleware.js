const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("🔹 Token received:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token decoded:", decoded);

      req.user = await User.findById(decoded.id).select("-password");
      console.log("✅ Authenticated User:", req.user);

      next();
    } catch (error) {
      console.error("❌ Authentication failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.log("❌ No token provided");
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };