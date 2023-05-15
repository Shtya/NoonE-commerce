const express = require("express")
const router = express.Router()

const { POST, GET, GETID, PUT, DELETE } = require("../controller/C_brand")
const {Resize , SingleImg} = require("../Factory/MulterSingle")
const { protect ,allowedTo} = require("../controller/C_auth")

router.post("/"      ,protect , allowedTo("admin" , "manger") , SingleImg("img") , Resize("brand") , POST)
router.put("/:id"    ,protect , allowedTo("admin" , "manger") , SingleImg("img") , Resize("brand") , PUT)
router.delete("/:id" ,protect , allowedTo("admin" , "manger") , DELETE)
router.get("/"       , GET)
router.get("/:id"    , GETID)

module.exports = router