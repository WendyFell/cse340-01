// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const invController = require("../controllers/invController")
const regValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build the inventory view by item detail unit 3 assignment 1.2.1
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInvId));

// Route to build the management view
router.get("/", utilities.handleErrors(invController.buildManager));

// Route to build classification insert form (unit 4 activity)
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to build classification insert form (unit 4 activity)
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Functionality to enable the addClassification route
router.post(
    "/add-classification", 
    regValidate.addClassificationRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

// Functionality to enable the addClassification route
router.post(
    "/add-inventory", 
    regValidate.addInventoryRules(),
    regValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)

module.exports = router;

