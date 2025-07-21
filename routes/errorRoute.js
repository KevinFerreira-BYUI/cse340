const express = require("express")
const router = new express.Router()
const errorController = require("../controllers/errorControler")

router.get("/error/404", errorController);
router.get("/error/500", errorController);

module.exports = router;