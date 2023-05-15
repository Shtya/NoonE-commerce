const express = require("express")
const router = express.Router({mergeParams:true})

const { POST, GET, GETID, PUT, DELETE } = require("../controller/C_subcategory")
const {V_POST} = require("../validators/V_subcategory")
const { protect ,allowedTo} = require("../controller/C_auth")

router.post("/"      ,protect , allowedTo("admin" , "manger") ,V_POST, POST)
router.put("/:id"    ,protect , allowedTo("admin" , "manger") , PUT)
router.delete("/:id" ,protect , allowedTo("admin" , "manger") , DELETE)
router.get("/" , GET)
router.get("/:id" , GETID)


module.exports = router