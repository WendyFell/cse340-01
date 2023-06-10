// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation') // unit 4 server-side activity

// Route to build account log in form (unit 4 activity)
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build account registration form (unit 4 activity)
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Functionality to enable the registration route
router.post(
    "/register", 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkloginData,
    (req, res) => {
      res.status(200).send('login process')
    }
)

module.exports = router;
