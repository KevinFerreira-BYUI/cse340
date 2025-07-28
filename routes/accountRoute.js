const express = require("express")
const router = new express.Router()
const accountsController = require("../controllers/accountController")
const util = require("../utilities")
const regValidate = require("../utilities/account-validation")

router.get("/login", util.handleErrors(accountsController.buildLogin))
router.get("/register", util.handleErrors(accountsController.buildRegister))
router.post(
    "/register", 
    regValidate.registerRules(),
    regValidate.checkRegData,
    util.handleErrors(accountsController.registerAccount)
)

router.post(
    "login",
    (req, res) =>{
        res.statuts(200).send("login process")
    }
)


module.exports = router