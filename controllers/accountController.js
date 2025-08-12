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
      account_email: accountData.account_email
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
  const classificationSelect = await util.buildClassificationList()
  res.render("./account/management", {
    title: "Management",
    nav,
    loginMsg: "You're logged in!",
    classificationSelect,
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

// build update account view
accountCont.buildUpdateView = async function(req, res) {
  let nav = await util.getNav()
  const account_id = parseInt(req.params.account_id)
  const data = await accountModel.getAccountInfosById(account_id)
  res.render("./account/update", {
    nav,
    title: `Update ${data.account_firstname} ${data.account_lastname} Informations`,
    account_firstname: data.account_firstname,
    account_lastname: data.account_lastname,
    account_email: data.account_email,
    account_id: data.account_id,
    errors: null
  })
}

// update account
accountCont.updateAccountInfo = async function(req, res, next) {
  const {account_firstname, account_lastname, account_email, account_id} = req.body

  const updateAccountInfo = await accountModel.updateAccountInfos(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (updateAccountInfo){
    req.flash("notice", "Your account infos has been changed!")
    res.redirect("/account/")
  }
}

// update password
accountCont.updatePassword = async function(req, res) {
  const account_id = parseInt(req.body.account_id)
  const account_password = req.body.account_password
  let nav = util.getNav()
  const data = await accountModel.getAccountInfosById(account_id)

  let hashedPassword
  try{
    hashedPassword = bcrypt.hashSync(account_password, 10)
  } catch (error){
    console.log(error)
    req.flash("notice", "Error at changing password, try again")
    res.render("./account/update", {
      nav,
      title: `Update ${data.account_firstname} ${data.account_lastname} Informations`,
      account_firstname: data.account_firstname,
      account_lastname: data.account_lastname,
      account_email: data.account_email,
      account_id: data.account_id,
      errors: null
    })
  }

  const updatePassword = await accountModel.updatePassword(hashedPassword, account_id)
  if (updatePassword){
    req.flash("notice", "Your Password has been changed!!")
    res.redirect("/account/")
  } else{
    req.flash("notice", "Your passwod hasn't been changed. Try again!")
    res.redirect("/account/")
  }
}

// log out process
accountCont.logout = async function(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You've been loged out!")
  res.redirect("/")
}


module.exports = accountCont

