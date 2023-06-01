/* Unit 3 MVC Implementation activity */
const utilities = require("../utilities/")
const baseController = {}

/* *******************
 * Build Home View
 * **************** */
baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  // req.flash("notice", "This is a flash message.") // (Activity unit 4-Sessions and Messages)
  res.render("index", {title: "Home", nav})
}

baseController.errorFunc = async function(req, res){
  // const nav = await utilities.getNav()
  res.render("index", {title: "Home", nav})
}

module.exports = baseController