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

validate.addVehicleRules = () => {
    return[
        body("classification_id")
            .notEmpty().withMessage("You need to choose a classification"),

        body("inv_make")
            .trim()
            .notEmpty().withMessage(`You cannot let Make empty`)
            .matches(/^[a-zA-Z]+( [a-zA-Z]+)*$/).withMessage(`Only letters and single spaces are allowed in Make`)
            .isLength({min:3}).withMessage("Type at least 3 alphabetic characters"),

        body("inv_model")
            .trim()
            .notEmpty().withMessage("You cannot let the Model empty")
            .matches(/^[a-zA-ZÀ-ÿ0-9 ]{3,}$/).withMessage("The Model cannot have symbols"),
        
        body("inv_description")
            .notEmpty().withMessage(`You cannot let Description empty`),

        body("inv_image", "inv_thumbnail")
            .trim()
            .notEmpty().withMessage(`You cannot let Image or Thumbnail empty`),

        body("inv_price")
            .trim()
            .notEmpty().withMessage(`You cannot let Price empty`)
            .matches(/^\d+(\.\d{1,2})?$/).withMessage("Invalid price format. Use numbers with up to 2 decimals"),

        body("inv_year")
            .trim()
            .notEmpty().withMessage(`You cannot let Years empty`)
            .matches(/^\d{4}$/).withMessage(`You need type only 4 digits in Years`),
        
        body("inv_miles")
            .trim()
            .notEmpty().withMessage(`You cannot let Miles empty`)
            .matches(/^\d+$/).withMessage(`Please enter a valid number without symbols or spaces in Miles`),
            
        
        body("inv_color")
            .notEmpty().withMessage("You cannot let Color empty")
            .matches(/^[A-Za-z]+( [A-Za-z]+)?$/).withMessage(`Only one or two words with alphabetic characters are allowed in Color`),
    ]   
}

validate.checkVehicleData = async (req, res, next) => {
    const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()){
        let nav = await util.getNav()
        let classificationList = await util.buildClassificationList()
        res.render("./inventory/new-vehicle", {
            title: "Add new vehicle",
            nav,
            errors,
            classificationList,
            classification_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color
        })
        return
    }
    next()
}

module.exports = validate
