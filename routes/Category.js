const express = require("express")
const router = express.Router()
const Subcategory =require("./Subcategory")

const { POST, GET, GETID, PUT, DELETE  } = require("../controller/C_category")
const { V_GET, V_POST } = require("../validators/V_category")
const { SingleImg , Resize } = require("../Factory/MulterSingle")
const { protect ,allowedTo} = require("../controller/C_auth")


router.post("/"      ,protect , allowedTo("admin" , "manger")  ,SingleImg("img") , Resize("category" ) , V_POST , POST)
router.put("/:id"    ,protect , allowedTo("admin" , "manger")  ,SingleImg("img") , Resize("category")  , PUT)
router.delete("/:id" ,protect , allowedTo("admin" , "manger")  , DELETE)
router.get("/"       , GET)
router.get("/:id"    ,V_GET , GETID)
router.use("/:cateId/subcategory" ,Subcategory)



module.exports = router