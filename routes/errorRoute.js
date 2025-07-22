const express = require("express")
const router = new express.Router()
const errorController = require("../controllers/errorControler")

router.use(errorController.notFound)

module.exports = router;