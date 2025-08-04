const express = require("express")
const router = new express.Router()
const accountsController = require("../controllers/accountController")
const util = require("../utilities")
const regValidate = require("../utilities/account-validation")
const logValidate = require("../utilities/account-validation")


// login route
router.get(
    "/login",
     util.handleErrors(accountsController.buildLogin)
    )

// router.post(
//     "/login",
//     logValidate.loginRules(),
//     logValidate.checkLoginData,
//     util.handleErrors(accountsController.accountLogin)
// )

router.post("/login", util.handleErrors(accountsController.accountLogin))

// Management route
router.get("/management", util.handleErrors(accountsController.buildManagement))

// Register route
router.get(
    "/register",
     util.handleErrors(accountsController.buildRegister)
    )

router.post(
    "/register", 
    regValidate.registerRules(),
    regValidate.checkRegData,
    util.handleErrors(accountsController.registerAccount)
)


module.exports = router