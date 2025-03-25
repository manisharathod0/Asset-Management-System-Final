
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const assetRoutes = require("./routes/assetRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const historyRoutes = require("./routes/historyRoutes");
const scanRoutes = require("./routes/scanRoutes"); 
const assignmentRoutes =require("./routes/assignmentRoutes.js");
const returnLogRoutes = require("./routes/returnLogRoutes.js");
const assetRequestRoutes = require('./routes/assetRequestRoutes');


const path = require("path");
const fs = require("fs");

// Load environment variables
dotenv.config();

// Connect to MongoDB - with error handling
const startServer = async () => {
  try {
    await connectDB();
    
    const app = express();
    
    // Ensure uploads directory exists with proper permissions
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      try {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log("Created uploads directory:", uploadDir);
        
        // Set directory permissions to 755 (rwxr-xr-x)
        fs.chmodSync(uploadDir, 0o755);
      } catch (error) {
        console.error("Error creating uploads directory:", error);
      }
    }
    
    // Enable CORS
    app.use(cors({ 
      origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
      credentials: true 
    }));
    
    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true })); // Added for form data
    
    
    // Serve static files with correct path
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));
    
    // Routes
    app.use("/api/users", userRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/assets", assetRoutes);
    app.use("/api/categories", categoryRoutes);
    app.use("/api/history", historyRoutes);
    app.use("/api", scanRoutes);
    app.use("/api/assign", assignmentRoutes);
    app.use('/api/return-logs', returnLogRoutes); 
    app.use('/api/assetrequests', assetRequestRoutes);

    
    // Express multer error handling middleware
    app.use((err, req, res, next) => {
      if (err.name === 'MulterError') {
        return res.status(400).json({ 
          message: `File upload error: ${err.message}` 
        });
      }
      next(err);
    });
    
    // Global Error Handling Middleware
    app.use((err, req, res, next) => {
      console.error("Server error:", err);
      res.status(500).json({ 
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    });
    
    // Start Server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();