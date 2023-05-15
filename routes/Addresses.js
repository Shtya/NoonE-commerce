const express = require("express")
const router = express.Router()

const { POST,DELETE , GET } = require("../controller/C_addresses")
const { protect ,allowedTo} = require("../controller/C_auth")

router.post("/"             ,protect , allowedTo("user") , POST)
router.delete("/:addressesId" ,protect , allowedTo("user") , DELETE)
router.get("/"              ,protect , allowedTo("user") , GET)


module.exports = router