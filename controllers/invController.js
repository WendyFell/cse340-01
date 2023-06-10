const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory view by item detail unit 3 assignment 1.2.2
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.inventoryId
  const data1 = await invModel.getInventoryByInvId(inv_id)
  
  const classMake = data1[0].inv_make
  const classModel = data1[0].inv_model
  const vehicleView = await utilities.buildVehicleView(data1)
  let nav = await utilities.getNav()
    
  res.render("./inventory/vehicle", {
    title: classMake + " " + classModel,
    nav,
    vehicleView,
  }) 
}

/* ***************************
 *  Build the manager view assignment 4 step 1
 * ************************** */
invCont.buildManager = async function (req, res, next) {
  let nav = await utilities.getNav()
    res.render("./inventory/management", {
      title: "Management",
      nav,
    })
}

/* ***************************
 *  Build the add classification view assignment 4 step 2
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      title: "Enter New Classification",
      nav, 
    })
}

/* ***************************
 *  Build the add classification view assignment 4 step 2
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let options = await utilities.getClassificationOpt()
    res.render("./inventory/add-inventory", {
      title: "Enter New Inventory",
      nav, 
      options,
    })
}

/* ***************************
 *  Process the classification add assignment 4 step 2
 * ************************** */
invCont.addClassification = async function (req, res) {
  const {classification_name} = req.body
  const classResult = await invModel.newClassification(classification_name)
  let nav = await utilities.getNav()
  if (classResult) {
    req.flash(
      "notice",
      `Congratulations, you added ${classification_name}!`
    )
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,

    })
  } else {
    req.flash("notice", "Sorry, the new classification wasn't entered.")
    res.status(501).render("./inventory/add-classification", {
      title: "Enter new classification",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Process the classification add assignment 4 step 2 make model year description image thumbnail mileage color classification-id
 * ************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model,inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,classification_id } = req.body
  
  const invResult = await invModel.newInventory(
    inv_make, 
    inv_model,
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id,    
    )
  
  if (invResult) {
    req.flash(
      "notice",
      `Congratulations, you added ${inv_make} ${inv_model}!`
    )
    res.status(201).render("./inventory/management", {
      title: "Management",
      nav,

    })
  } else {
    req.flash("notice", "Sorry, the new inventory wasn't entered.")
    let options = await utilities.getClassificationOpt()
    res.status(501).render("./inventory/add-inventory", {
      title: "Enter new inventory",
      nav,
      options,
      errors: null,
    })
  }
}

invCont.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = invCont