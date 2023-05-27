const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}
// const invView = {}

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
  const inv_id = req.params.invId
  const data1 = await invModel.getInventoryByInvId(inv_id)
  const vehicleView = await utilities.buildVehicleView(data1)
  let nav = await utilities.getNav()
  const classModel = data1[0].inv_model
  const classMake = data1[0].inv_make
  res.render("./inventory/vehicle", {
    title: classMake + " " + classModel,
    nav,
    vehicleView,
  }) 
}

module.exports = invCont