const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = '<ul class="menu">'
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid += '<div class="li-content">'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<h2>'
      grid += '<a class="t" href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

// build the Inventory Detail view
Util.buildInventoryDetailsGrid = async function(data) {
  let gridDetails = ""
  if (data.length > 0){
    const vehicle = data[0];
    gridDetails += `<section id="inv-details-container">
                      <div class="vehicleImg-details-container">
                        <img class="vehicle-img" src="${vehicle.inv_image}" alt="${vehicle.inv_make} image">
                      </div>
                      <div class="vehicle-details-container">
                        <h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>
                        <p class="vehicle-price"><strong>Price: ${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</strong></p>
                        <p class="vehicle-description"><strong>Description: </strong>${vehicle.inv_description}</p>
                        <p class="vehicle-color"><strong>Color: </strong>${vehicle.inv_color}</p>
                        <p class="vehicle-miles"><strong>Miles: </strong>${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}</p>
                        <button class="download-btn" id="downloadBtn" data-id="${vehicle.inv_id}">Download Image</button>
                      </div>
                    </section>`
  } else {
    gridDetails += `<p class="notice">Sorry, no matching ${vehicle.inv_make} ${vehicle.inv_model} could be found.</p>`
  }
  return gridDetails
}

Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += '<option value="" disabled selected hidden>Choose a Classification</option>'
    data.rows.forEach((row) => {
      classificationList += `<option value="${row.classification_id}"`
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += `> ${row.classification_name} </option>`
    })                       
    classificationList += "</select>"
    return classificationList
  }


 //Middleware For Handling Errors
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


// Middleware to check token validity
Util.checkJWTToken = (req, res, next) => {
  res.locals.loggedin = 0
  res.locals.accountData = null

 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("notice", "Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}


Util.checkLogin = (req, res, next) => {
  if(res.locals.loggedin) {
    next()
  } else{
    req.flash("notice", "Please log in!!")
    return res.redirect("/account/login")
  }
}

module.exports = Util

