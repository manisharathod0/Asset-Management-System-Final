const express = require("express");
const User = require("../models/User");

const router = express.Router();

// ➤ Register User
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
