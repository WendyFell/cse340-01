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
 *  Build the inventory management view assignment 4 step 1
 * ************************** */
invCont.buildManager = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.getClassificationOpt()
    res.render("./inventory/management", {
      title: "Management",
      nav,
      errors: null,
      classificationSelect,
    })
}

/* ***************************
 *  Build the add classification view. assignment 4 step 2
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      title: "Enter New Classification",
      nav, 
      errors: null,
    })
}

/* ***************************
 *  Build the add inventory view. assignment 4 step 2
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationSelect = await utilities.getClassificationOpt()
    res.render("./inventory/add-inventory", {
      title: "Enter New Inventory",
      nav, 
      classificationSelect,
      errors: null,
    })
}

/* ***************************
 *  Process the classification add. assignment 4 step 2
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
 *  Process the inventory add. assignment 4 step 2 
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
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the new inventory wasn't entered.")
    let classificationSelect = await utilities.getClassificationOpt()
    res.status(501).render("./inventory/add-inventory", {
      title: "Enter new inventory",
      nav,
      classificationSelect,
      errors: null,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON (unit 5 select inventory items activity)
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build the edit inventory view. Unit 5 update inventory step 1. 
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInvId(inv_id)
  console.log(itemData)
  const classificationSelect = await utilities.getClassificationOpt(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.getClassificationOpt(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build the delete inventory view. Unit 5 delete inventory. 
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInvId(inv_id)
  res.render("inventory/delete-confirm", {
    title: "Delete " ,
    nav,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  // const inv_id = parseInt(req.params.inv_id)
  const { inv_id } = req.body
  const deleteResult = await invModel.deleteInventory(inv_id)

  if (deleteResult) {    
    req.flash("notice", "The vehicle was deleted")
    res.redirect("/inv/")
  } else {
    const itemData = await invModel.getInventoryByInvId(inv_id)
    console.log(itemData)
    req.flash("notice", "Sorry, the delete failed.")
    res.render("inventory/delete-confirm", {
      title: "Delete ",
      nav,
      errors: null,
      inv_id: itemData[0].inv_id,
      inv_make: itemData[0].inv_make,
      inv_model: itemData[0].inv_model,
      inv_year: itemData[0].inv_year,
      inv_price: itemData[0].inv_price,
    })
  }
}

invCont.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = invCont