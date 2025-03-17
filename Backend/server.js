const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const assetRoutes = require("./routes/assetRoutes");

const app = express();

// Middleware
app.use(express.json()); // Parse JSON
app.use(cors());

// Routes
app.use("/api/assets", assetRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log(error.message));
