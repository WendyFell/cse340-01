// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build the inventory view by item detail unit 3 assignment 1.2.1
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInvId));

module.exports = router;

