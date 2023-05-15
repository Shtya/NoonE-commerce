const express = require("express")
const router = express.Router({mergeParams:true})
const Review = require("./Review")


const { POST, GET, GETID, PUT, DELETE, ImgFields , ResizeImg } = require("../controller/C_product")
const { V_GET, V_POST } = require("../validators/V_product")
const { protect ,allowedTo} = require("../controller/C_auth")

router.post("/"      ,protect , allowedTo("admin" , "manger") , ImgFields , ResizeImg,V_POST , POST)
router.put("/:id"    ,protect , allowedTo("admin" , "manger") , ImgFields , ResizeImg,V_GET , PUT)
router.delete("/:id" ,protect , allowedTo("admin" , "manger") ,V_GET , DELETE)
router.get("/" , GET)
router.get("/:id" ,V_GET , GETID)
router.use("/:productId/review" , Review)


module.exports = router