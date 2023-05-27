const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1",
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

// /* ***************************
//  *  Get data for specific vehicle in inventory based on classification_id unit 3 assignment 1.2.3
//  * ************************** */
async function getInventoryByInvId(inv_id) {
  try {
    const data1 = await pool.query(
      "SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.inv_id = $1",
      [inv_id]
    )
    return data1.rows
  } catch (error) {
    console.error("getinventorybyid error " + error)
  }
}


module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInvId};