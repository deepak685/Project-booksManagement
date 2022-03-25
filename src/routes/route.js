const express = require("express")

const router = express.Router()
const controller1 = require("../controller/userController")


router.post("/createuser", controller1.createUser)
router.post("/userLogin", controller1.login)

module.exports = router