const express = require("express");

const { login, signup } = require("../controllers/authController"); // Ensure correct path


const router = express.Router();

// Define routes
router.post("/login", login);
router.post("/signup", signup);



module.exports = router;