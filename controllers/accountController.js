const util = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const pool = require("../database")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const accountCont = {}

// Deliver Login view
 accountCont.buildLogin = async function (req, res, next){
    let nav = await util.getNav()
    res.render("./account/login", {
        nav,
        title: "Login",
        login: "My Account",
        errors: null
    })
}


// Login process
accountCont.accountLogin = async function(req, res) {
  let nav = await util.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return 
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        login: "My Account",
        errors: null,
        account_email: accountData.account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

//Management view
accountCont.buildManagement = async function(req, res, next) {
  let nav = await util.getNav()
  const welcomeMsg = req.flash("notice", "Welcome Bro!")
  res.render("./account/management", {
    title: "Management",
    nav,
    welcomeMsg,
    loginMsg: "You're logged in!",
    errors: null
  })
}


// Deliver Register view
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
    hashedPassword = await bcrypt.hashSync(account_password, 10)
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

