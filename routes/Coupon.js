const express = require("express")
const router = express.Router()

const { POST, GET, GETID, PUT, DELETE } = require("../controller/C_coupon")
const {Resize , SingleImg} = require("../Factory/MulterSingle")
const { protect ,allowedTo} = require("../controller/C_auth")

router.use(protect , allowedTo("admin" , "manger"))
router.post("/"      , POST)
router.put("/:id"    , PUT)
router.delete("/:id" , DELETE)
router.get("/"       , GET)
router.get("/:id"    , GETID)

module.exports = router