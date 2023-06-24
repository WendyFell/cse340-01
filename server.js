/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const baseController = require("./controllers/baseController") /* Unit 3 MVC implementation activity */
const utilities = require("./utilities/")
const session = require ("express-session")
const pool = require("./database/")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser") /* unit 5 login */

/* ***********************
 * Middleware
 * ************************/
app.use(session({ //(Activity unit 4-Sessions and Messages)
  store: new (require('connect-pg-simple')(session))({ 
    createTableIfMissing: true, 
    pool, 
  }),
  secret: process.env.SESSION_SECRET,
  resave: true, 
  saveUninitialized: true, 
  name: 'sessionId', 
}))

// Express Messages Middleware (Activity unit 4-Sessions and Messages)
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res) 
  next()
})

// unit 4 process registration activity, makes the body-parser available
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Unit 5 JWT and Cookie activity, allows the cookie parser to be implemented
app.use(cookieParser()) 
app.use(utilities.checkJWTToken)

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // folder structure implemented, so not found at root of views folder.

/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"))

// Index route
/* Unit 3 MVC implementation activity */
/* app.get("/", baseController.buildHome) */
app.get("/", utilities.handleErrors(baseController.buildHome)) 

// Inventory routes
app.use("/inv", require("./routes/inventoryRoute"))
app.use("/account", require("./routes/accountRoute")) /* unit 4 deliver login activity will also deliver register */

// error link
app.get("/error", utilities.handleErrors(baseController.errorFunc))

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, Keep trying.'})
})


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404) { message = err.message } else {message = 'Oops! Try a different route'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
