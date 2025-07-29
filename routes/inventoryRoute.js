// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const util = require("../utilities")

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
    invController.addNewClassification,
    util.handleErrors(invController.addNewClassification)
)

module.exports = router;
