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
  const account_id = parseInt(req.body.account_id)
  const { account_firstname, account_lastname, account_email } = req.body
  const infoChangeResult = await accountModel.updateAccountInfo( 
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  )
  console.log(infoChangeResult)
  const accountById = await accountModel.getAccountById(account_id)
  res.locals.accountData = accountById

  if (infoChangeResult && accountById) {
    utilities.deleteCookie
    const accountData = await accountModel.getAccountById(account_id)
    accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    
    req.flash(
      "notice",
      `${account_firstname}, your information was changed.`
    )
    res.status(201).render("account/account-management", {
      title: "Manage Account",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the change failed.")
    res.status(501).render("account/update", {
      title: "Manage Account",
      nav,
      errors: null,
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
  const passChangeResult = await accountModel.updatePassword( 
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

/* ***************************
 *  Build inbox view (final project)
 * ************************** */
async function buildInbox (req, res, next) {
  console.log("Jump")
  const message_to =  res.locals.accountData.account_id 
  let messageData = await accountModel.getInboxData(message_to)
  console.log(messageData)
  const messageTable = await utilities.buildInbox(messageData)
  // console.log(messageTable)
  const firstName = res.locals.accountData.account_firstname
  const lastName = res.locals.accountData.account_lastname
  let nav = await utilities.getNav()
  res.render("./account/inbox", {
    title: `${firstName} ${lastName} Inbox` ,
    nav,
    errors: null,
    messageTable,
  })
}

/* ***************************
 *  Build message reader view (final project)
 * ************************** */
async function buildMessageReader(req, res, next) {
  console.log("Luke")
  const message_id =  parseInt(req.params.message_id)
  // console.log(message_id)
  let nav = await utilities.getNav()
  const messageData = await accountModel.getMessageById(message_id)
  console.log (messageData)
  const subject = messageData[0].message_subject
  res.render("account/read-message", {
    title: `Message: ${subject}`,
    nav,
    errors: null,
    message_id: messageData[0].message_id,
    message_subject: messageData[0].message_subject,
    message_from1: messageData[0].accountfrom_firstname,
    message_from2: messageData[0].accountfrom_lastname,
    message_body: messageData[0].message_body,
    
  })
}  

/* ***************************
 *  Build new message view (final project)
 * ************************** */
async function buildNewMessage (req, res, next) {
  console.log("Yellow")
  let nav = await utilities.getNav()
  let accountOptions = await utilities.getAccountOptions()
  res.render("./account/new-message", {
      title: "New Message",
      nav, 
      accountOptions,
      errors: null,
    })
}

/* ***************************
 *  Process the new message (final project)
 * ************************** */
async function addNewMessage (req, res, next) {
  console.log("Pew")
  let nav = await utilities.getNav()
  const  { message_subject, message_body,  message_from } = req.body
  const message_to = res.locals.account_id
  const messageResult = await accountModel.newMessage(  message_subject, message_body, message_to, message_from)
  console.log(message_from)
  if (messageResult) {
    req.flash(
      "notice",
      `Message sent`
    )
    const message_from =  res.locals.accountData.account_id
    console.log(message_from)
    let messageData = await accountModel.getInboxData(message_from)
    console.log(messageData)
    const messageTable = await utilities.buildInbox(messageData)
    const firstName = messageData[0].messageto_firstname
    const lastName = messageData[0].messageto_lastname
    res.status(201).render("./account/inbox", {
      title: `${firstName} ${lastName} Inbox`,
      nav,
      errors: null,
      messageTable
    })
  } else {
    req.flash("notice", "Sorry, the new message wasn't sent.")
    const accountOptions = await utilities.getAccountOptions()
    res.status(501).render("./account/new-message", {
      title: "New message",
      nav,
      accountOptions,
      errors: null
    })
  }
}

/* ***************************
 *  Delete Message
 * ************************** */
async function deleteMessage (req, res, next) {
  console.log ("super")
  const message_id =  parseInt(req.params.message_id)
  console.log(message_id)
  const deleteResult = await accountModel.deleteMessage(message_id)   


  if (deleteResult) {   
    req.flash("notice", "The message was deleted")
    const message_to = res.locals.accountData.account_id
    console.log(message_to)
    let messageData = await accountModel.getInboxData(message_to)
    // console.log(messageData)
    const messageTable = await utilities.buildInbox(messageData)
    let nav = await utilities.getNav()
    const firstName = res.locals.accountData.account_firstname
    const lastName = res.locals.accountData.account_lastname
    res.status(201).render("./account/inbox", {
      title: `${firstName} ${lastName} Inbox`,
      nav,
      errors: null,
      messageTable
    })
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("./account/inbox", {
      title: "Messages",
      nav,
      errors: null,
      messageTable
    })
  }
}

/* ***************************
 *  Build archived message view (final project)
 * ************************** */
async function buildArchivedMessage (req, res, next) {
  // console.log("yoda")
  const message_to =  res.locals.accountData.account_id 
  // console.log(message_to)
  let archivedMessageData = await accountModel.getArchivedData(message_to)
  // console.log(archivedMessageData)
  const archivedMessageTable = await utilities.buildArchiveInbox(archivedMessageData)
  // console.log(archivedMessageTable)
  let nav = await utilities.getNav()
  res.render("./account/archived-message", {
    title: `Archived Messages` ,
    nav,
    errors: null,
    archivedMessageTable,
  })
}

/* ***************************
 *  Archive Message (final project)
 * ************************** */
async function archiveMessage (req, res, next) {
  console.log ("lemon")
  const message_id =  parseInt(req.params.message_id)
  console.log(message_id)
  const archiveResult = await accountModel.archiveMessage(message_id)   


  if (archiveResult) {   
    req.flash("notice", "The message was archived")
    const message_to = res.locals.accountData.account_id
    console.log(message_to)
    const messageData = await accountModel.getInboxData(message_to)
    console.log(messageData)
    const messageTable = await utilities.buildInbox(messageData)
    let nav = await utilities.getNav()
    const firstName = messageData[0].messageto_firstname
    const lastName = messageData[0].messageto_lastname
    res.status (201).render("./account/inbox", {
      title: `${firstName} ${lastName} Inbox`,
      nav,
      errors: null,
      messageTable
    })
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("./account/inbox", {
      title: "Messages",
      nav,
      errors: null,
      messageTable
    })
  }
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
  logout,
  buildInbox, 
  buildMessageReader,
  buildNewMessage,
  addNewMessage,
  deleteMessage, 
  buildArchivedMessage,
  archiveMessage
};