// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// // Route to build the inventory view by item detail unit 3 assignment 1.2.1
router.get("/type/:invId", invController.buildByInvId);

module.exports = router;

