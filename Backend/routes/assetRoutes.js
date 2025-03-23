

// const express = require("express");
// const router = express.Router();
// const Asset = require("../models/Asset");
// const { assignAsset, getAssignedAssets } = require("../controllers/assetController"); // don't delete
// const History = require("../models/History");
// const Category = require("../models/Category");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // Configure multer for image uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadDir = path.join(__dirname, "../uploads");
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, file.fieldname + "-" + uniqueSuffix + ext);
//   }
// });

// const upload = multer({ 
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
//   fileFilter: function(req, file, cb) {
//     const filetypes = /jpeg|jpg|png|gif|webp/;
//     const mimetype = filetypes.test(file.mimetype);
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
//     if (mimetype && extname) {
//       return cb(null, true);
//     }
//     cb(new Error("Only image files are allowed!"));
//   }
// });

// // Serve static files from the uploads directory
// router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// // ➤ Add a new asset with image upload
// router.post("/", upload.single("image"), async (req, res) => {
//   try {
//     const { name, category, status, description, quantity, expiryDate } = req.body;

//     // Parse quantity as a number
//     const parsedQuantity = parseInt(quantity, 10) || 1;

//     // Validate expiry date
//     const parsedExpiryDate = expiryDate ? new Date(expiryDate) : null;

//     // Check if an asset with the same name already exists
//     const existingAsset = await Asset.findOne({ name });
//     if (existingAsset) {
//       if (req.file) {
//         fs.unlinkSync(req.file.path);
//       }
//       return res.status(409).json({ message: "Asset with this name already exists" });
//     }

//     // Create the new asset object
//     const assetData = { 
//       name, 
//       category, 
//       status, 
//       description,
//       quantity: parsedQuantity,
//       expiryDate: parsedExpiryDate
//     };
    
//     if (req.file) {
//       assetData.image = req.file.filename;
//     }

//     const asset = new Asset(assetData);
//     await asset.save();

//     // Log the action in the history
//     const historyEntry = new History({
//       asset: asset._id,
//       action: "Created",
//       user: "Admin",
//     });
//     await historyEntry.save();

//     res.status(201).json(asset);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ➤ Get all assets
// router.get("/", async (req, res) => {
//   try {
//     const assets = await Asset.find();
//     res.status(200).json(assets);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ➤ Update an asset with image upload
// router.put("/:id", upload.single("image"), async (req, res) => {
//   try {
//     const assetId = req.params.id;
//     const { name, category, status, description, quantity, expiryDate } = req.body;
    
//     // Parse quantity as a number
//     const parsedQuantity = parseInt(quantity, 10) || 1;

//     // Validate expiry date
//     const parsedExpiryDate = expiryDate ? new Date(expiryDate) : null;

//     // Find the current asset
//     const currentAsset = await Asset.findById(assetId);
//     if (!currentAsset) {
//       if (req.file) {
//         fs.unlinkSync(req.file.path);
//       }
//       return res.status(404).json({ message: "Asset not found" });
//     }
    
//     // Update the asset data
//     const updateData = {
//       name,
//       category,
//       status,
//       description,
//       quantity: parsedQuantity,
//       expiryDate: parsedExpiryDate
//     };
    
//     // If there's a new image, update it and remove the old one
//     if (req.file) {
//       if (currentAsset.image) {
//         const oldImagePath = path.join(__dirname, "../uploads", currentAsset.image);
//         if (fs.existsSync(oldImagePath)) {
//           fs.unlinkSync(oldImagePath);
//         }
//       }
//       updateData.image = req.file.filename;
//     }
    
//     // Update the asset
//     const asset = await Asset.findByIdAndUpdate(assetId, updateData, { new: true });

//     // Log the action in the history
//     const historyEntry = new History({
//       asset: asset._id,
//       action: "Updated",
//       user: "Admin",
//     });
//     await historyEntry.save();

//     res.status(200).json(asset);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ➤ Delete an asset (with image cleanup)
// router.delete("/:id", async (req, res) => {
//   try {
//     const asset = await Asset.findById(req.params.id);
    
//     if (!asset) {
//       return res.status(404).json({ message: "Asset not found" });
//     }
    
//     // Delete the associated image file if it exists
//     if (asset.image) {
//       const imagePath = path.join(__dirname, "../uploads", asset.image);
//       if (fs.existsSync(imagePath)) {
//         fs.unlinkSync(imagePath);
//       }
//     }
    
//     // Delete the asset document
//     await Asset.findByIdAndDelete(req.params.id);

//     // Log the action in the history
//     const historyEntry = new History({
//       asset: asset._id,
//       action: "Deleted",
//       user: "Admin",
//     });
//     await historyEntry.save();

//     res.status(200).json({ message: "Asset deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ➤ Export assets as CSV or Excel
// router.get("/export", async (req, res) => {
//   try {
//     const assets = await Asset.find();
    
//     // Generate CSV data
//     let csvData = "Asset ID,Name,Category,Status,Quantity,Expiry Date,Description\n";
    
//     assets.forEach(asset => {
//       const expiryDate = asset.expiryDate ? new Date(asset.expiryDate).toLocaleDateString() : "N/A";
//       const escapedName = asset.name ? `"${asset.name.replace(/"/g, '""')}"` : "";
//       const escapedCategory = asset.category ? `"${asset.category.replace(/"/g, '""')}"` : "";
//       const escapedDescription = asset.description ? `"${asset.description.replace(/"/g, '""')}"` : "";
      
//       csvData += `${asset._id},${escapedName},${escapedCategory},${asset.status},${asset.quantity || 1},${expiryDate},${escapedDescription}\n`;
//     });
    
//     // Set headers for CSV download
//     res.setHeader('Content-Type', 'text/csv');
//     res.setHeader('Content-Disposition', 'attachment; filename=assets.csv');
    
//     // Send the CSV data
//     res.send(csvData);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ➤ The rest of your routes remain unchanged...

// module.exports = router;
const express = require("express");
const router = express.Router();
const Asset = require("../models/Asset");
const { assignAsset, getAssignedAssets } = require("../controllers/assetController"); // don't delete
const History = require("../models/History");
const Category = require("../models/Category");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Enhanced error logging middleware
router.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  }
});

// Serve static files from the uploads directory
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ➤ Add a new asset with image upload - UPDATED with better error handling
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { name, category, status, description, quantity, expiryDate } = req.body;

    // Check for required fields
    if (!name || !category) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: "Name and category are required fields" });
    }

    console.log("Parsed data:", { name, category, status, description, quantity, expiryDate });

    // Parse quantity as a number
    const parsedQuantity = parseInt(quantity, 10) || 1;

    // Validate expiry date
    let parsedExpiryDate = null;
    if (expiryDate && expiryDate.trim() !== '') {
      parsedExpiryDate = new Date(expiryDate);
      if (isNaN(parsedExpiryDate.getTime())) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ message: "Invalid expiry date format" });
      }
    }

    // Check if an asset with the same name already exists
    const existingAsset = await Asset.findOne({ name });
    if (existingAsset) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(409).json({ message: "Asset with this name already exists" });
    }

    // Create the new asset object
    const assetData = { 
      name, 
      category, 
      status: status || "Available", 
      description: description || "",
      quantity: parsedQuantity,
      expiryDate: parsedExpiryDate
    };
    
    if (req.file) {
      assetData.image = req.file.filename;
    }

    console.log("Asset data to save:", assetData);

    // Create and save the asset directly
    const asset = new Asset(assetData);
    await asset.save();

    // Log the action in the history
    try {
      const historyEntry = new History({
        asset: asset._id,
        action: "Created",
        user: "Admin",
      });
      await historyEntry.save();
    } catch (historyError) {
      console.error("Error saving history entry:", historyError);
      // Continue even if history save fails
    }

    res.status(201).json(asset);
  } catch (error) {
    console.error("Error creating asset:", error);
    // Clean up uploaded file if there was an error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error removing uploaded file:", unlinkError);
      }
    }
    res.status(500).json({ 
      error: error.message || "Server Error",
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Rest of your routes remain the same...
// ➤ Get all assets
router.get("/", async (req, res) => {
  try {
    const assets = await Asset.find();
    res.status(200).json(assets);
  } catch (error) {
    console.error("Error fetching assets:", error);
    res.status(500).json({ error: error.message });
  }
});

// ➤ Update an asset with image upload
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const assetId = req.params.id;
    const { name, category, status, description, quantity, expiryDate } = req.body;
    
    // Parse quantity as a number
    const parsedQuantity = parseInt(quantity, 10) || 1;

    // Validate expiry date
    let parsedExpiryDate = null;
    if (expiryDate && expiryDate.trim() !== '') {
      parsedExpiryDate = new Date(expiryDate);
      if (isNaN(parsedExpiryDate.getTime())) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ message: "Invalid expiry date format" });
      }
    }

    // Find the current asset
    const currentAsset = await Asset.findById(assetId);
    if (!currentAsset) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: "Asset not found" });
    }
    
    // Update the asset data
    const updateData = {
      name,
      category,
      status: status || "Available",
      description: description || "",
      quantity: parsedQuantity,
      expiryDate: parsedExpiryDate
    };
    
    // If there's a new image, update it and remove the old one
    if (req.file) {
      if (currentAsset.image) {
        try {
          const oldImagePath = path.join(__dirname, "../uploads", currentAsset.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (unlinkError) {
          console.error("Error removing old image:", unlinkError);
          // Continue even if old image removal fails
        }
      }
      updateData.image = req.file.filename;
    }
    
    // Update the asset
    const asset = await Asset.findByIdAndUpdate(assetId, updateData, { new: true });

    // Log the action in the history
    try {
      const historyEntry = new History({
        asset: asset._id,
        action: "Updated",
        user: "Admin",
      });
      await historyEntry.save();
    } catch (historyError) {
      console.error("Error saving history entry:", historyError);
      // Continue even if history save fails
    }

    res.status(200).json(asset);
  } catch (error) {
    console.error("Error updating asset:", error);
    res.status(500).json({ error: error.message });
  }
});

// ➤ Delete an asset (with image cleanup)
router.delete("/:id", async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }
    
    // Delete the associated image file if it exists
    if (asset.image) {
      try {
        const imagePath = path.join(__dirname, "../uploads", asset.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (unlinkError) {
        console.error("Error removing image file:", unlinkError);
        // Continue even if image removal fails
      }
    }
    
    // Delete the asset document
    await Asset.findByIdAndDelete(req.params.id);

    // Log the action in the history
    try {
      const historyEntry = new History({
        asset: asset._id,
        action: "Deleted",
        user: "Admin",
      });
      await historyEntry.save();
    } catch (historyError) {
      console.error("Error saving history entry:", historyError);
      // Continue even if history save fails
    }

    res.status(200).json({ message: "Asset deleted successfully" });
  } catch (error) {
    console.error("Error deleting asset:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;