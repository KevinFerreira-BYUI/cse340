const util = require("../utilities")

const accountCont = {}

// Deliver Login view
 accountCont.buildLogin = async function (req, res, next){
    let nav = await util.getNav()
    res.render("./account/login", {
        nav,
        title: "Login",
    })
} 

module.exports = accountCont