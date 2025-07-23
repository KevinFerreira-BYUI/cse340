const express = require("express")
const router = new express.Router()
const accountsController = require("../controllers/accountController")
const util = require("../utilities")

router.get("/login", accountsController.buildLogin);

module.exports = router