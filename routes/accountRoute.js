// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

// Route to build account log in form (unit 4 activity)
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build account registration form (unit 4 activity)
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Functionality to enable the registration route
router.post("/register", utilities.handleErrors(accountController.registerAccount))


module.exports = router;
