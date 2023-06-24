const utilities = require("../utilities/")
const accountModel = require("../models/account-model") 
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view (unit 4 activity)
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }

/* ****************************************
*  Deliver registration view (unit 4 activity)
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}  

 /* ****************************************
*  Deliver account management view (unit 5 team activity)
* *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}  

/* ****************************************
*  Deliver update account view (unit 5 assignment)
* *************************************** */
async function buildUpdateAccount(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)
  res.render("account/update", {
    title: "Manage Account",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id:accountData.account_id
  })
}  

/* ****************************************
*  Process Registration (unit 4 activity)
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request, Unit 5, Login using JWT and Cookies
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  console.log(accountData)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/") 
   } else {
    req.flash("notice", "Something is wrong with the password")
    return res.redirect("/account/login") 
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

/* ****************************************
*  Process update (unit 4 activity)
* *************************************** */
async function updateAccountInfo(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  const infoChangeResult = await accountModel.updateAccountInfo( 
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  )

  if (infoChangeResult) {
    req.flash(
      "notice",
      `${account_firstname}, your information was changed.`
    )
    res.status(201).render("/account/mangement", {
      title: "Manage Account",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the change failed.")
    res.status(501).render("account/update", {
      title: "Manage Account",
      nav,
    })
  }
}

/* ****************************************
*  Process Registration (unit 4 activity)
* *************************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the update.')
    res.status(500).render("account/update", {
      title: "Manage Account",
      nav,
      errors: null,
    })
  }

  const passChangeResult = await accountModel.registerAccount( // ******** new model here **********
    hashedPassword
  )

  if (passChangeResultResult) {
    req.flash(
      "notice",
      `${account_firstname}, your password changed.`
    )
    res.status(201).render("account/update", {
      title: "Manage Account",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the password change failed.")
    res.status(501).render("account/update", {
      title: "Manage Account",
      nav,
    })
  }
}

/* ****************************************
*  Logout function (unit 5 assignment)
* *************************************** */
async function logout(req, res, next) {
  res.clearCookie("jwt")
  return res.redirect("/")
}  


module.exports = { 
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  buildManagement, 
  buildUpdateAccount, 
  updateAccountInfo, 
  updatePassword, 
  logout 
};