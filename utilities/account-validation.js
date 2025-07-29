const util = require(".")
const {body, validationRules, validationResult} = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}

// Registation data validation rules

validate.registerRules = () =>{
    return[
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min:1})
            .withMessage("Please provide a first name!"),

        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min:2})
            .withMessage("Please provide a last name!"),

        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required!")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists){
                    throw new Error ("Email exists. Please log in or use different email ")
                }
            }),

        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password doesn't meet requirements.")
    ]
}

validate.checkRegData = async (req, res, next) => {
    const {account_firstname, account_lastname, account_email} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await util.getNav()
        res.render("account/register", {
            title: "Registration",
            nav,
            errors,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

// Login data validation rules

validate.loginRules = () =>{
    return[
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("Enter a valid email!"),

        body("account_password")
            .trim()
            .notEmpty()
            .withMessage("Enter the password!")
    ]
}

validate.checkLoginData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = util.getNav()
        res.render("account/login", {
            title: "Login",
            nav,
            errors,
        })
        return
    }
    next()
}

module.exports = validate