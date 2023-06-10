/* Unit 4 server side data validation activity */
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventory-model")

const validate = {}

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.addClassificationRules = () => {
    return [
      // classification name is required and must be string
      body("classification_name")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Please provide a classification name."), // on error this message is sent.
    ]
}


/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const classification_name = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}


/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.addInventoryRules = () => {
  return [    
    // valid make is required and must be string
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a vehicle make."), // on error this message is sent.
      
    // valid model
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a vehicle model."),

    // valid year
    body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })  
      .withMessage("Please provide a vehicle year."),

    // valid description
    body("inv_description")
      .trim()
      .isLength({ min: 20 })      
      .withMessage("Please provide a longer description."),

    // valid image
    body("inv_image")
      .trim(),     
      // .withMessage("Please provide a jpg."),

    // valid thumbnail image
    body("inv_thumbnail")
      .trim(),     
      // .withMessage("Please provide a jpg."),

    // valid price
    body("inv_price")
      .trim() ,    
      // .withMessage("Please provide a jpg."),

    //valid mileage
    body("inv_miles")
      .trim()
      .isInt()
      .withMessage("Please provide mileage."),

    // valid color
    body("inv_color")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a vehicle color."),
  ]
}


  /* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let options = await utilities.getClassificationOpt()
    res.render("inventory/add-inventory", {
      errors,
      title: "Enter New Inventory",
      nav,
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
      options
    })
    return
  }
  next()
}
  
  module.exports = validate