const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // Import database connection
const assetRoutes = require("./routes/assetRoutes");


dotenv.config(); // Load .env variables
connectDB(); // Connect to MongoDB

const app = express();
app.use(express.json()); // Enable JSON parsing

const PORT = process.env.PORT || 5000;
app.use("/api/assets", assetRoutes);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
