const express = require("express")
const router = new express.Router()
const accountsController = require("../controllers/accountController")
const util = require("../utilities")
const regValidate = require("../utilities/account-validation")
const logValidate = require("../utilities/account-validation")
const { route } = require("./static")


// login route
router.get(
    "/login",
     util.handleErrors(accountsController.buildLogin)
)

router.post(
    "/login",
    logValidate.loginRules(),
    logValidate.checkLoginData,
    util.handleErrors(accountsController.accountLogin)
)

// Management route
router.get(
    "/", 
    util.checkLogin,
    util.handleErrors(accountsController.buildManagement)
)

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

// log out process
router.get(
    "/logout",
    util.handleErrors(accountsController.logout)
)

// update view
router.get(
    "/update/:account_id",
    util.checkLogin,
    util.handleErrors(accountsController.buildUpdateView)
)

// update action post
router.post(
    "/update/",
    //util.handleErrors(accountsController.updateAccountInfo)
    accountsController.updateAccountInfo
)

module.exports = router