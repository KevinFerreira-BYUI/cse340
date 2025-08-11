const { render } = require("ejs")
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
  const classificationSelect = await util.buildClassificationList()
  res.render("./account/management", {
    title: "Vehicle management",
    nav,
    errors: null,
    classificationSelect  
  })
}

// build new classification view
invCont.buildNewClassification = async function(req, res, next) {
  let nav = await util.getNav()
  res.render("./inventory/new-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
}

// Add the new classification
invCont.addNewClassification = async function(req, res) {
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

// Build the new vehicle view
invCont.buildNewVehicle = async function(req, res) {
  let nav = await util.getNav()
  let classificationList = await util.buildClassificationList()
  res.render("./inventory/new-vehicle", {
    title: "Add Vehicle",
    nav,
    classificationList,
    errors: null
  })
}

invCont.addNewVehicle = async function(req, res) {

  const {
    classification_id,
    inv_make, 
    inv_model,
    inv_description,  
    inv_image,
    inv_thumbnail,     
    inv_price,
    inv_year,
    inv_miles,
    inv_color
    
  } = req.body

  const addVehicleResult = await invModel.insertNewVehicle(
    classification_id,
    inv_make, 
    inv_model,
    inv_description,  
    inv_image,
    inv_thumbnail,     
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  )

  if (addVehicleResult){
    req.flash(
      "notice",
      "New Vehicle has been added!"
    )
  }

  res.redirect("/inv/newVehicle")
}

invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id){
    return res.json(invData)
  } else{
    next(new Error ("No data returned"))
  }
}


invCont.editInventoryView = async function(req, res, next) {
  let nav = await util.getNav()
  const inv_id = req.params.inv_id
  const invItemData = await invModel.getEspecificIdFromInventory(inv_id)
  const invItemName = `${invItemData.inv_make} ${invItemData.inv_model}` 
  const classificationSelect = await util.buildClassificationList(invItemData.classification_id)
  res.render("./inventory/edit-inventory", {
    title: `Edit ${invItemName}`,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: invItemData.inv_id,
    inv_make: invItemData.inv_make,
    inv_model: invItemData.inv_model,
    inv_year: invItemData.inv_year,
    inv_description: invItemData.inv_description,
    inv_image: invItemData.inv_image,
    inv_thumbnail: invItemData.inv_thumbnail,
    inv_price: invItemData.inv_price,
    inv_miles: invItemData.inv_miles,
    inv_color: invItemData.inv_color,
    classification_id: invItemData.classification_id
  }) 
}

invCont.updateInventory = async function(req, res) {

  const {
    classification_id,
    inv_make, 
    inv_model,
    inv_description,  
    inv_image,
    inv_thumbnail,     
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    inv_id
    
  } = req.body

  const updateResult = await invModel.updateInventory(
    classification_id,
    inv_make, 
    inv_model,
    inv_description,  
    inv_image,
    inv_thumbnail,     
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    inv_id
  )

  if (updateResult){
    const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`
    req.flash(
      "notice",
      `The ${itemName} was successfully updated!`
    )
    res.redirect("/inv/")
  } else{
    const classificationSelect = await util.buildClassificationList(classification_id)
    const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`
    req.flash(
      "notice",
      "Sorry, the insert failed."
    )
    res.status(501).render("inventory/edit-inventory", {
      title: `Edit ${itemName}`,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      inv_id
    })
  }
}

invCont.buildDeleteView = async function (req, res, next) {
  let nav = await util.getNav()
  const inv_id = parseInt(req.params.inv_id)
  const getInvItem = await invModel.getEspecificIdFromInventory(inv_id)

  res.render("./inventory/delete", {
    title: `Delete ${getInvItem.inv_make} ${getInvItem.inv_model}`,
    nav,
    errors: null,
    inv_make: getInvItem.inv_make,
    inv_model: getInvItem.inv_model,
    inv_price: getInvItem.inv_price,
    inv_year: getInvItem.inv_year,
    inv_id: getInvItem.inv_id
  })
}

invCont.deleteVehicle = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id)
  const deleteItem = await invModel.deleteInventory(inv_id)

  if (deleteItem) {
    req.flash("notice","This vehicle was DELETED!")
    res.redirect("/inv/")
  } else{
    req.flash("notice", "The vehicle wasn't deleted because an error")
    res.redirect("/inv/delete/inv_id")
  }
}


module.exports = invCont 
