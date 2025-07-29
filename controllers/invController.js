const invModel = require("../models/inventory-model")
const util = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await util.buildClassificationGrid(data)
  let nav = await util.getNav()
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
  const gridDetails = await util.buildInventoryDetailsGrid(data)
  let nav = await util.getNav()
  const invYear = data[0].inv_year
  const invMake = data[0].inv_make
  const invModel_db = data[0].inv_model
  res.render("./inventory/inventoryDetail", {
    nav,
    title: `${invYear} ${invMake} ${invModel_db}`,
    gridDetails,
  })
}

// build inv management
invCont.buildManagement = async function(req, res, next) {
  let nav = await util.getNav()
  res.render("./inventory/management", {
    title: "Vehicle management",
    nav,
  })
}

// build new classification view
invCont.buildNewClassification = async function(req, res, next) {
  let nav = await util.getNav()
  res.render("./inventory/new-classification", {
    title: "Add New Classification",
    nav,
  })
}

invCont.addNewClassification = async function(req, res) {
  let nav = await util.getNav()
  const {classification_name} = req.body

  const addClassResult = await invModel.insertClassification(classification_name)

  if (addClassResult){
    req.flash(
      "notice", 
      `You've registered <i>${classification_name}</i> as a vehicle classification!`
    )

    res.redirect("/inv/newClassification")
  }
}

module.exports = invCont 