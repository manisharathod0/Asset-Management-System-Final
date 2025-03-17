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