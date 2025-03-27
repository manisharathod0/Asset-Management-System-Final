const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');

router.get('/pending', maintenanceController.getAssets);
router.post('/scheduled-maintenance', maintenanceController.scheduleMaintenance);
router.get('/scheduled-maintenance', maintenanceController.getScheduledMaintenance);
router.put('/scheduled-maintenance/:id', maintenanceController.updateMaintenanceStatus);
router.delete('/scheduled-maintenance/:id', maintenanceController.deleteMaintenance); // Added delete route
router.post("/report", maintenanceController.reportIssue);

module.exports = router;