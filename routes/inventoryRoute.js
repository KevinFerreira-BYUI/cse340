// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const util = require("../utilities")
const newClassificationValidate = require("../utilities/news-validation")
const newVehicleValidate = require("../utilities/news-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", util.handleErrors(invController.buildByClassificationId));

// Route to build inventory Details view
router.get("/detail/:invId", util.handleErrors(invController.buildInventoryDetails));

// Route to build the management view
router.get("/", util.handleErrors(invController.buildManagement));

// Route to build new classification view
router.get("/newClassification", util.handleErrors(invController.buildNewClassification));

router.post(
    "/newClassification",
    newClassificationValidate.addClassRules(),
    newClassificationValidate.checkClassificationData,
    util.handleErrors(invController.addNewClassification)
)

// Route to build new vehicle view
router.get("/newVehicle", util.handleErrors(invController.buildNewVehicle))

router.post(
    "/newvehicle",
    newVehicleValidate.addVehicleRules(),
    newVehicleValidate.checkVehicleData,
    util.handleErrors(invController.addNewVehicle)
)

router.get(
    "/getInventory/:classification_id",
    util.handleErrors(invController.getInventoryJSON)
)

router.get(
    "/edit/:inv_id",
    util.handleErrors(invController.editInventoryView)
)

router.post(
    "/edit/",
    newVehicleValidate.addVehicleRules(),
    newVehicleValidate.checkEditData,
    util.handleErrors(invController.updateInventory)
)

router.get(
    "/delete/:inv_id",
    util.handleErrors(invController.buildDeleteView)
)

router.post(
    "/delete/",
    util.handleErrors(invController.deleteVehicle)
)

// download image from vehicle details
router.get(
    "/download-image/:inv_id",
    util.handleErrors(invController.downloadImg)
)

module.exports = router;
