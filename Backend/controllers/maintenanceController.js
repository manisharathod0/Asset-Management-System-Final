const Maintenance = require('../models/Maintenance'); // Assuming you have a Maintenance model

exports.getAssets = async (req, res) => {
  try {
      const pendingAssets = await Maintenance.find({ status: "pending" });
      console.log("Fetched Pending Assets:", pendingAssets); // Debug log
      res.status(200).json(pendingAssets);
  } catch (error) {
      console.error("Error fetching pending assets:", error);
      res.status(500).json({ message: "Server error" });
  }
}


exports.scheduleMaintenance = async (req, res) => {
  const maintenance = new Maintenance({
    assetId: req.body.assetId,
    assetName: req.body.assetName,
    date: req.body.date,
    technician: req.body.technician,
    task: req.body.task,
    status:"scheduled",
  });

  try {
    const newMaintenance = await maintenance.save();
    res.status(201).json(newMaintenance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.getScheduledMaintenance = async (req, res) => {
  try {
    const scheduledMaintenance = await Maintenance.find();
    res.json(scheduledMaintenance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMaintenanceStatus = async (req, res) => {
  try {
    const updatedMaintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedMaintenance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteMaintenance = async (req, res) => {
  try {
    const deletedMaintenance = await Maintenance.findByIdAndDelete(req.params.id);
    if (!deletedMaintenance) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }
    res.json({ message: 'Maintenance record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.reportIssue = async (req, res) => {
  try {
    const { assetName, assetId, category, issueDescription } = req.body;

    if (!assetName || !assetId || !category || !issueDescription) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Use the correct Maintenance model
    const newMaintenance = new Maintenance({
      assetName,
      assetId,
      category,
      task: issueDescription, // Store issue as the task
      status: "pending", // Default status as 'pending'
      date: new Date(), // Add current date
    });

    await newMaintenance.save();

    res.status(201).json({ message: "Issue reported successfully" });
  } catch (error) {
    console.error("Error reporting issue:", error);
    res.status(500).json({ message: "Server error" });
  }
};