const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  res.render("index", {
    title: "Home",
    nav,
    login: "My Account"
  })
}

module.exports = baseController