const AssetRequest = require('../models/AssetRequest');

exports.createAssetRequest = async (req, res) => {
  try {
    const assetRequest = new AssetRequest(req.body);
    await assetRequest.save();
    res.status(201).json(assetRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllAssetRequests = async (req, res) => {
  try {
    const assetRequests = await AssetRequest.find().populate('asset');
    res.status(200).json(assetRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAssetRequestById = async (req, res) => {
  try {
    const assetRequest = await AssetRequest.findById(req.params.id).populate('asset');
    if (!assetRequest) {
      return res.status(404).json({ message: 'Asset request not found' });
    }
    res.status(200).json(assetRequest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAssetRequest = async (req, res) => {
  try {
    const assetRequest = await AssetRequest.findByIdAndDelete(req.params.id);
    if (!assetRequest) {
      return res.status(404).json({ message: 'Asset request not found' });
    }
    res.status(200).json({ message: 'Asset request deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
