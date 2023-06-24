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

// Route to build classification/inventory in management view (unit 5 select inventory items activity)
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to edit inventory (unit 5 update inventory part 1)
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView));

// Route to delete inventory (unit 5 dlete inventory)
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteInventory));

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

// Functionality to watch for and direct the incoming request to the controller for updating the inventory. Unit 5
router.post("/update", 
    regValidate.addInventoryRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

// Functionality to watch for and direct the incoming request to the controller for updating the inventory. Unit 5
router.post("/delete", utilities.handleErrors(invController.deleteInventory))

module.exports = router;

