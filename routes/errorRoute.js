const express = require("express")
const router = new express.Router()
const errorController = require("../controllers/errorControler")

router.get("/error/test-500", (req, res, next) => {
    const error = new Error("Error 500")
    error.status = 500
    next(error)
})

router.use(errorController.notFound)


module.exports = router;