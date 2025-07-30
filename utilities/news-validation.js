const util = require(".")
const {body, validationRules, validationResult} = require("express-validator")
const invodel = require("../models/inventory-model")
const validate = {}

validate.addClassRules = () => {
    return[
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isAlpha()
            .withMessage("Please enter a valid parameter")
            .custom(async (classification_name) => {
                const existClassifiation = await invodel.getExistClasificationName(classification_name) 

                if (existClassifiation){
                    throw new Error (`The Classification ${classification_name} already exist, please enter an diferent classification`)
                }
            })
    ]
}

validate.checkClassificationData = async(req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await util.getNav()
        res.render("./inventory/new-classification", {
            title: "Add New Classification",
            nav,
            errors
        })
        return
    }
    next()
}

// validate.addVehicleRules = () => {
//     return[

//     ]
// }

module.exports = validate
