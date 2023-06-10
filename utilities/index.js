/* Unit 3 MVC implementation activity */
const invModel = require("../models/inventory-model")
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

// /* **************************************
//  * Custom function that gets the vehicle information and wraps it up in HTML 
//  * Unit 3 assignment 1.2.4
//  * ************************************ */
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

// /* **************************************
//  * Custom function that gets the classification information and puts it in a option  
//  * Unit 4 assignment 4.3
//  * ************************************ */
// Util.classificationIdName = async function(data){
//   const data1 = await invModel.getInventoryByClassificationId(classification_id)
//   let classificationName
//   if(data1.length > 0){
//     classificationName = '<select name="classification_id">'
//     '<option value="Select Value"></option>'
//     data1.forEach(vehicle => { 
//       classificationName += '<option value= '+ vehicle.classification_id + '>' 
//       + vehicle.classification_name + '</option>'
//     })
//     classificationName += '</select>'
//   } else { 
//     classificationName += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
//   }
//   return classificationName
// }

Util.getClassificationOpt = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let opt = '<select name="classification_id" class="selectItems">'
  opt += '<option value="0">Select Classification</option>'
  data.rows.forEach((row) => {
    opt += '<option value= '+ row.classification_id + '>' 
      + row.classification_name + '</option>'
  })

  opt += "</select>"

  return opt
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util