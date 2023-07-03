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

// Route to build account management view (unit 5 activity)
router.get(
    "/", 
    utilities.checkLogin, 
    utilities.handleErrors(accountController.buildManagement)
);

// Route to build update form (unit 5 assignment)
router.get("/update", utilities.handleErrors(accountController.buildUpdateAccount));

//Route for destroying cookie assignment 5
router.get('/logout', utilities.handleErrors(accountController.logout));

// Route to build the inbox. Final project
router.get("/inbox/:accountId", utilities.handleErrors(accountController.buildInbox));

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
    utilities.checkJWTToken, //unit 5
    regValidate.loginRules(),
    regValidate.checkloginData,
    utilities.handleErrors(accountController.accountLogin) // unit 5
)

// Process the update attempt assignment 5
router.post(
    "/updateAccount",
    regValidate.updateAccountRules(),
    regValidate.checkAccountData,
    utilities.handleErrors(accountController.updateAccountInfo),
)

// Process the update attempt assignment 5
router.post(
    "/updatePassword",
    regValidate.updatePasswordRules(),
    utilities.handleErrors(accountController.updatePassword),
)

module.exports = router;
