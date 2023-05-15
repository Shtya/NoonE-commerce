const express = require("express")
const router = express.Router({mergeParams:true})

const { POST, GET, GETID, PUT, DELETE } = require("../controller/C_review")
const { protect ,allowedTo} = require("../controller/C_auth")
const { V_POST,V_PUT , V_DELETE } = require("../validators/V_review")

router.post("/"      ,protect , allowedTo("user") ,V_POST , POST)
router.put("/:id"    ,protect , allowedTo("user") ,V_PUT , PUT)
router.delete("/:id" ,protect , allowedTo("user","admin") , V_DELETE , DELETE)
router.get("/"       , GET)
router.get("/:id"    , GETID)

module.exports = router