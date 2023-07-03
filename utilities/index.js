/* Unit 3 MVC implementation activity */
const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id  
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
 * Custom function that gets the vehicle information and wraps it up in HTML 
 * Unit 3 assignment 1.2.4
 * ************************************ */
Util.buildVehicleView = async function(data1){
  let vehicleView
  if(data1.length > 0){
    vehicleView = '<ul id="inv-item-display">'
    data1.forEach(vehicle => { 
      vehicleView += '<li>'      
      vehicleView +=   '<div class="vehicleImage">' + '<img src=' + vehicle.inv_image 
      +' alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors">' + '</div>'

      vehicleView += '<div class="itemInfo">'   
      vehicleView += '<h2 class="makeModel">'
      vehicleView +=  vehicle.inv_make + ' ' + vehicle.inv_model + ' Description'
      vehicleView += '</h2>'
      vehicleView += '<span class="year">Year: ' + vehicle.inv_year + '</span>'
      vehicleView += '<span class="price"> Price: $' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      vehicleView += '<span class="mileage">Mileage: ' + new Intl.NumberFormat().format(vehicle.inv_miles) + '</span>'
      vehicleView += '<span class="description"> Description: ' + vehicle.inv_description + '</span>'
      vehicleView += '</div>'
      vehicleView += '</li>'
    })
    vehicleView += '</ul>'
  } else { 
    vehicleView += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return vehicleView
}

/* **************************************
 * Custom function that gets the classification name and wraps it up in the select option tag 
 * Unit 4
 * ************************************ */
Util.getClassificationOpt = async function (optionSelected = null) {
  let data = await invModel.getClassifications()
  
  let opt = '<select name="classification_id" id="classificationList" class="selectItems">'
  opt += '<option value="">Select Classification</option>'
  data.rows.forEach((row) => {
    opt += `<option value= "${row.classification_id}" ${row.classification_id ===  Number(optionSelected) ? " selected " : ""} > 
      ${row.classification_name}</option>`
  })

  opt += "</select>"

  return opt
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
      if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
      }
      res.locals.accountData = accountData
      res.locals.loggedin = 1
      next()
    })
  } else {
    next()
  }
}

/* ****************************************
*  Check Login
* ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* Delete cookie on update account */
Util.deleteCookie = (req, res, next) => {
  if (req.cookies.jwt) {
    res.clearCookie("jwt")
    return res.redirect("/")
  }
  res.locals.accountData = null
  res.locals.loggedin = 0
      next()
}

/* **************************************
* Build the classification view HTML
* ************************************ */
// Util.buildInboxView = async function(messageData){

//   let accountList
//   if(messageData.length > 0){
//     accountList = '<ul id="message-display">'
//     messageData.forEach(message => { 
//       accountList += '<li>'
//       accountList +=  '<a href="../../account/inbox/'+ message.message_id + '" title="View Message"></a>'
      
//       grid += '</li>'
//     })
//     accountList += '</ul>'
//   } else { 
//     accountList += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
//   }
//   return accountList
// }
Util.buildInbox = async function (req, res, next) {
  let messageData = await invModel.getInboxData()
  let accountList = "<ul>"
  messageData.rows.forEach((row) => {
    accountList += "<li>"
    accountList +=
      '<a href="/account/inbox/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
      accountList += "</li>"
  })
  accountList += "</ul>"
  return accountList
}
// function buildInventoryList(data) { 
//   let inventoryDisplay = document.getElementById("inventoryDisplay"); 
//   // Set up the table labels 
//   let dataTable = '<thead>'; 
//   dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
//   dataTable += '</thead>'; 
//   // Set up the table body 
//   dataTable += '<tbody>'; 
//   // Iterate over all vehicles in the array and put each in a row 
//   data.forEach(function (element) { 
//    console.log(element.inv_id + ", " + element.inv_model); 
//    dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
//    dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`; 
//    dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`; 
//   }) 
//   dataTable += '</tbody>'; 
//   // Display the contents in the Inventory Management view 
//   inventoryDisplay.innerHTML = dataTable; 
//  } 



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util