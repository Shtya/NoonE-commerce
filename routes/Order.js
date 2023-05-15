const express = require("express")
const router = express.Router()

const {CreateOrder, GetAllOrder , GetIdOrder, IsPaid, IsDeliver, Session} = require("../controller/C_order")
const { protect ,allowedTo} = require("../controller/C_auth")

router.post("/:cartId"      ,protect , allowedTo("user" ) , CreateOrder)
router.get("/"              ,protect , allowedTo("user" ) , GetAllOrder)
router.get("/:orderId"      ,protect , allowedTo("user" ) , GetIdOrder)
router.post("/ispaid/:orderId"     ,protect , allowedTo("user" ) , IsPaid)
router.post("/isdeliver/:orderId"  ,protect , allowedTo("user" ) , IsDeliver)
router.post("/create-checkout-session/:cartId"  ,protect , allowedTo("user" ) , Session)


module.exports = router