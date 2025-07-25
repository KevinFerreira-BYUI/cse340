const express = require("express")
const router = new express.Router()
const accountsController = require("../controllers/accountController")
const util = require("../utilities")

router.get("/login", util.handleErrors(accountsController.buildLogin))
router.get("/register", util.handleErrors(accountsController.buildRegister))
router.post("/register", util.handleErrors(accountsController.registerAccount))

module.exports = router