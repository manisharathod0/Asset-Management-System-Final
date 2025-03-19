// const express = require("express");
// const router = express.Router();
// const Asset = require("../models/Asset");

// // ➤ Add a new asset
// router.post("/", async (req, res) => {
//   try {
//     const { name, category, status } = req.body;
//     const asset = new Asset({ name, category, status });
//     await asset.save();
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

// // ➤ Update an asset
// router.put("/:id", async (req, res) => {
//   try {
//     const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.status(200).json(asset);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ➤ Delete an asset
// router.delete("/:id", async (req, res) => {
//   try {
//     await Asset.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Asset deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;



// const express = require("express");
// const router = express.Router();
// const Asset = require("../models/Asset");

// // ➤ Add a new asset
// router.post("/", async (req, res) => {
//   try {
//     const { name, category, status, description } = req.body;
//     const asset = new Asset({ name, category, status, description });
//     await asset.save();
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

// // ➤ Update an asset
// router.put("/:id", async (req, res) => {
//   try {
//     const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.status(200).json(asset);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ➤ Delete an asset
// router.delete("/:id", async (req, res) => {
//   try {
//     await Asset.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Asset deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });




// module.exports = router;
// const express = require("express");
// const router = express.Router();
// const Asset = require("../models/Asset");

// // ➤ Add a new asset
// router.post("/", async (req, res) => {
//   try {
//     const { name, category, status, description } = req.body;

//     // Check if an asset with the same name already exists
//     const existingAsset = await Asset.findOne({ name });
//     if (existingAsset) {
//       return res.status(409).json({ message: "Asset with this name already exists" });
//     }

//     // Create and save the new asset
//     const asset = new Asset({ name, category, status, description });
//     await asset.save();
//     res.status(201).json(asset);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Asset = require("../models/Asset");
const { assignAsset, getAssignedAssets } = require("../controllers/assetController");//dont delete
const History = require("../models/History");
const Category = require("../models/Category");

// ➤ Add a new asset
router.post("/", async (req, res) => {
  try {
    const { name, category, status, description } = req.body;

    // Check if an asset with the same name already exists
    const existingAsset = await Asset.findOne({ name });
    if (existingAsset) {
      return res.status(409).json({ message: "Asset with this name already exists" });
    }

    // Create and save the new asset
    const asset = new Asset({ name, category, status, description });
    await asset.save();

    // Log the action in the history
    const historyEntry = new History({
      asset: asset._id,
      action: "Created",
      user: "Admin", // Replace with actual user from authentication
    });
    await historyEntry.save();

    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ Get all assets
router.get("/", async (req, res) => {
  try {
    const assets = await Asset.find();
    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ Update an asset
router.put("/:id", async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Log the action in the history
    const historyEntry = new History({
      asset: asset._id,
      action: "Updated",
      user: "Admin", // Replace with actual user from authentication
    });
    await historyEntry.save();

    res.status(200).json(asset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ Delete an asset
router.delete("/:id", async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);

    // Log the action in the history
    const historyEntry = new History({
      asset: asset._id,
      action: "Deleted",
      user: "Admin", // Replace with actual user from authentication
    });
    await historyEntry.save();

    res.status(200).json({ message: "Asset deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/assign", async (req, res) => {
  try {
    const { assetId, assignedTo } = req.body;

    if (!assetId || !assignedTo) {
      return res.status(400).json({ error: "Asset ID and Assigned User are required" });
    }

    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    // ✅ Correct: Only update existing asset
    asset.status = "Assigned";
    asset.assignedTo = assignedTo;
    await asset.save();

    res.status(200).json({ message: "Asset assigned successfully", asset });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// Mark an Asset as Returned
router.put("/return/:id", async (req, res) => {
  const { returnedBy, returnDate, condition, notes } = req.body;

  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ error: "Asset not found" });

    asset.status = "Returned";
    asset.assignedTo = null;
    asset.returnDetails = { returnedBy, returnDate, condition, notes };

    await asset.save();
    res.json({ message: "Asset returned successfully", asset });
  } catch (error) {
    res.status(500).json({ error: "Error updating asset return details" });
  }
});

// Fetch only returned assets
router.get("/returned", async (req, res) => {
  try {
    const returnedAssets = await Asset.find({ status: "Returned" }).populate("returnDetails.returnedBy", "name");
    res.json(returnedAssets);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching returned assets" });
  }
});

// Get all asset requests
router.get("/", async (req, res) => {
  try {
    const requests = await AssetRequest.find();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new asset request
router.post("/", async (req, res) => {
  const { asset, requestedBy } = req.body;
  
  try {
    const newRequest = new AssetRequest({ asset, requestedBy });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update asset request status
router.patch("/:id", async (req, res) => {
  try {
    const updatedRequest = await AssetRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an asset request
router.delete("/:id", async (req, res) => {
  try {
    await AssetRequest.findByIdAndDelete(req.params.id);
    res.json({ message: "Request deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// ➤ Add a new category
router.post("/categories", async (req, res) => {
  try {
    const { name } = req.body;

    // Check if a category with the same name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(409).json({ message: "Category with this name already exists" });
    }

    // Create and save the new category
    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ Get all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ Delete a category
router.delete("/categories/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ Get asset history
router.get("/history", async (req, res) => {
  try {
    const history = await History.find().populate("asset");
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;