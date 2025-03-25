const express = require("express");
const Asset = require("../models/Asset");
const History = require("../models/History");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const router = express.Router();




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

// ➤ Add a new asset with image upload - UPDATED with better error handling and history tracking
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

    // Log the action in the history with new fields
    try {
      const historyEntry = new History({
        asset: asset._id,
        action: "Created",
        user: "Admin",
        quantityChange: true,
        imageChange: !!req.file,
        expiryDateChange: !!parsedExpiryDate
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

// ➤ Get asset history - new endpoint
router.get("/history", async (req, res) => {
  try {
    const history = await History.find().populate("asset").sort({ date: -1 });
    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching asset history:", error);
    res.status(500).json({ error: error.message });
  }
});

// ➤ Export assets to different formats (CSV, XLSX, PDF)
router.get("/export/:format", async (req, res) => {
  try {
    const format = req.params.format.toLowerCase();
    const assets = await Asset.find();
    
    // Format asset ID function
    const formatAssetId = (id) => {
      return `AST-${id.toString().slice(-6).toUpperCase()}`;
    };
    
    // Format date function
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString();
    };
    
    if (format === 'csv') {
      // CSV Export
      let csv = "Asset ID,Name,Category,Status,Quantity,Expiry Date,Description\n";
      
      assets.forEach(asset => {
        const expiryDate = asset.expiryDate ? formatDate(asset.expiryDate) : "N/A";
        const assetId = formatAssetId(asset._id);
        csv += `"${assetId}","${asset.name}","${asset.category}","${asset.status}","${asset.quantity || 1}","${expiryDate}","${asset.description || ''}"\n`;
      });
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=assets.csv');
      return res.status(200).send(csv);
      
    } else if (format === 'xlsx') {
      // Excel Export
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Assets');
      
      // Add header row with styling
      worksheet.columns = [
        { header: 'Asset ID', key: 'id', width: 15 },
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Category', key: 'category', width: 15 },
        { header: 'Status', key: 'status', width: 18 },
        { header: 'Quantity', key: 'quantity', width: 10 },
        { header: 'Expiry Date', key: 'expiryDate', width: 15 },
        { header: 'Description', key: 'description', width: 30 }
      ];
      
      // Style the header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '3A6D8C' }
      };
      worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
      
      // Add asset data
      assets.forEach(asset => {
        worksheet.addRow({
          id: formatAssetId(asset._id),
          name: asset.name,
          category: asset.category,
          status: asset.status,
          quantity: asset.quantity || 1,
          expiryDate: asset.expiryDate ? formatDate(asset.expiryDate) : "N/A",
          description: asset.description || ''
        });
      });
      
      // Apply status color coding
      const statusColors = {
        'Available': '008000', // green
        'Assigned': '0000FF',  // blue
        'Under Maintenance': 'FF0000', // red
        'Retired': '808080',   // gray
        'Returned': 'FFA500'   // orange
      };
      
      // Apply color to status column
      for (let i = 2; i <= assets.length + 1; i++) {
        const status = worksheet.getCell(`D${i}`).value;
        if (status && statusColors[status]) {
          worksheet.getCell(`D${i}`).font = {
            color: { argb: statusColors[status] },
            bold: true
          };
        }
      }
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=assets.xlsx');
      
      // Write to buffer and send response
      const buffer = await workbook.xlsx.writeBuffer();
      return res.status(200).send(buffer);
      
    } else if (format === 'pdf') {
      // PDF Export
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      
      // Set response headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=assets.pdf');
      
      // Pipe PDF directly to response
      doc.pipe(res);
      
      // Add a title
      doc.fontSize(18).text('Asset Inventory Report', { align: 'center' });
      doc.moveDown();
      
      // Add the date
      doc.fontSize(10).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'right' });
      doc.moveDown(2);
      
      // Define table layout
      const tableTop = 150;
      const tableLeft = 30;
      const colWidths = [80, 100, 70, 80, 60, 80, 100]; // widths for each column
      const rowHeight = 25;
      
      // Draw table header
      doc.fontSize(10).font('Helvetica-Bold');
      
      // Draw header background
      doc.fillColor('#3A6D8C')
         .rect(tableLeft, tableTop, doc.page.width - tableLeft * 2, rowHeight)
         .fill();
      
      // Draw header text
      doc.fillColor('white');
      const headers = ['Asset ID', 'Name', 'Category', 'Status', 'Quantity', 'Expiry Date', 'Description'];
      let xPos = tableLeft;
      
      headers.forEach((header, i) => {
        doc.text(header, xPos + 5, tableTop + 8, { width: colWidths[i], align: 'left' });
        xPos += colWidths[i];
      });
      
      // Draw table rows
      doc.font('Helvetica');
      let yPos = tableTop + rowHeight;
      
      // Define status colors for PDF
      const pdfStatusColors = {
        'Available': '#008000', // green
        'Assigned': '#0000FF',  // blue
        'Under Maintenance': '#FF0000', // red
        'Retired': '#808080',   // gray
        'Returned': '#FFA500'   // orange
      };
      
      // Draw alternating row backgrounds and data
      assets.forEach((asset, index) => {
        // Draw row background (alternating)
        doc.fillColor(index % 2 === 0 ? '#f4f4f4' : 'white')
           .rect(tableLeft, yPos, doc.page.width - tableLeft * 2, rowHeight)
           .fill();
        
        // Reset position
        xPos = tableLeft;
        
        // Format data for each cell
        const rowData = [
          formatAssetId(asset._id),
          asset.name,
          asset.category,
          asset.status,
          asset.quantity || 1,
          asset.expiryDate ? formatDate(asset.expiryDate) : "N/A",
          asset.description || ''
        ];
        
        // Draw each cell
        rowData.forEach((text, i) => {
          // Use status color for status column
          if (i === 3 && pdfStatusColors[text]) {
            doc.fillColor(pdfStatusColors[text]);
          } else {
            doc.fillColor('black');
          }
          
          doc.text(String(text), xPos + 5, yPos + 8, { 
            width: colWidths[i], 
            align: 'left',
            lineBreak: false,
            ellipsis: true
          });
          
          xPos += colWidths[i];
        });
        
        // Move to next row
        yPos += rowHeight;
        
        // Add a new page if needed
        if (yPos > doc.page.height - 50) {
          doc.addPage();
          yPos = 50;
          
          // Add column headers to new page
          doc.fontSize(10).font('Helvetica-Bold');
          doc.fillColor('#3A6D8C')
             .rect(tableLeft, yPos, doc.page.width - tableLeft * 2, rowHeight)
             .fill();
          
          doc.fillColor('white');
          let headerXPos = tableLeft;
          
          headers.forEach((header, i) => {
            doc.text(header, headerXPos + 5, yPos + 8, { width: colWidths[i], align: 'left' });
            headerXPos += colWidths[i];
          });
          
          doc.font('Helvetica');
          yPos += rowHeight;
        }
      });
      
      // Add total count
      doc.moveDown(2);
      doc.fillColor('black').font('Helvetica-Bold');
      doc.text(`Total Assets: ${assets.length}`, tableLeft, yPos + 20);
      
      // Finalize PDF
      doc.end();
      return;
      
    } else {
      return res.status(400).json({ message: "Unsupported export format. Please use 'csv', 'xlsx', or 'pdf'." });
    }
  } catch (error) {
    console.error(`Error exporting assets as ${req.params.format}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// ➤ Update an asset with image upload and improved history tracking
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
    
    // Check for changes to track in history
    const quantityChanged = currentAsset.quantity !== parsedQuantity;
    const expiryDateChanged = 
      (currentAsset.expiryDate && !parsedExpiryDate) || 
      (!currentAsset.expiryDate && parsedExpiryDate) ||
      (currentAsset.expiryDate && parsedExpiryDate && 
        new Date(currentAsset.expiryDate).toISOString() !== parsedExpiryDate.toISOString());
    
    // Update the asset data
    const updateData = {
      name,
      category,
      status: status || "Available",
      description: description || "",
      quantity: parsedQuantity,
      expiryDate: parsedExpiryDate
    };
    
    // Track if image was changed
    let imageChanged = false;
    
    // If there's a new image, update it and remove the old one
    if (req.file) {
      imageChanged = true;
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

    // Log the action in the history with detailed change tracking
    try {
      const historyEntry = new History({
        asset: asset._id,
        action: "Updated",
        user: "Admin",
        quantityChange: quantityChanged,
        imageChange: imageChanged,
        expiryDateChange: expiryDateChanged
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
        quantityChange: false,
        imageChange: false,
        expiryDateChange: false
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