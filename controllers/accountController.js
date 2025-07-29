const util = require("../utilities")
const accountModel = require("../models/account-model")
const bccrypt = require("bcryptjs")
const pool = require("../database")
const accountCont = {}

// Deliver Login view
 accountCont.buildLogin = async function (req, res, next){
    let nav = await util.getNav()
    res.render("./account/login", {
        nav,
        title: "Login",
        errors: null
    })
}

accountCont.buildRegister = async function(req, res, next){
    let nav = await util.getNav()
    res.render("./account/register", {
        nav,
        title: "Register",
        errors: null
    })
}

accountCont.registerAccount = async function(req, res) {
  let nav = await util.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  let hashedPassword
  try{
    hashedPassword = await bccrypt.hashSync(account_password, 10)
  } catch(error){
    req.flash("notice", "Sorry, there was an error processing the registration...")
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}


module.exports = accountCont




