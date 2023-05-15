const express = require("express")
const router = express.Router()

const { AddCart,GetCart, DeleteCart, DeleteAllCart, PUTQuantity, ApplyCoupon } = require("../controller/C_cart")
const { protect ,allowedTo} = require("../controller/C_auth")

router.use(protect ,allowedTo("user"))
router.post("/"      , AddCart)
router.get("/"      , GetCart)
router.delete("/:productId"  , DeleteCart)
router.delete("/"  , DeleteAllCart)
router.put("/applyCoupon"  , ApplyCoupon)
router.put("/:productId"  , PUTQuantity)


module.exports = router