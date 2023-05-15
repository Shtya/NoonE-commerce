const express = require("express")
const router = express.Router()

const { POST, GET, GETID, PUT, DELETE, Img, Resize, PUTPassword, GetMe } = require("../controller/C_user")
const { V_POST , V_PUT, V_PUTPassword } = require("../validators/V_user")
const { protect ,allowedTo} = require("../controller/C_auth")

router.post("/"              , protect , allowedTo("admin" , "manger") ,Img , Resize,V_POST ,POST)
router.put("/:id"            , protect , allowedTo("admin" , "manger") ,Img , Resize,V_PUT , PUT)
router.put("/changepass/:id" , protect , allowedTo("admin" , "manger") ,V_PUTPassword, PUTPassword)
router.get("/"               , protect , allowedTo("admin" , "manger") , GET)
router.get("/:id"            , protect , allowedTo("admin" , "manger") , GETID)
router.delete("/:id"         , protect , allowedTo("admin" , "manger") , DELETE)


module.exports = router