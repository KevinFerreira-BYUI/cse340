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
    nav,
    title: `${className} vehicles`,
    grid,
  })
}

// build inventory details by their Id
invCont.buildInventoryDetails = async function(req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryById(inv_id)
  const gridDetails = await utilities.buildInventoryDetailsGrid(data)
  let nav = await utilities.getNav()
  const invYear = data[0].inv_year
  const invMake = data[0].inv_make
  const invModel_db = data[0].inv_model
  res.render("./inventory/inventoryDetail", {
    nav,
    title: `${invYear} ${invMake} ${invModel_db}`,
    gridDetails,
  })
}

module.exports = invCont 