const express = require("express")
const router = express.Router()

const { Signup ,Img , Resize, Login, ForgotPassword, verifyPassResetCode, resetPassword} = require("../controller/C_auth")
const { V_POST , V_PUTPassword } = require("../validators/V_auth")

router.post("/signup"   ,Img , Resize , V_POST ,Signup)
router.post("/login"    ,Login)
router.post("/forgotPassword"   ,ForgotPassword)
router.post("/verifyPassResetCode"   ,verifyPassResetCode)
router.post("/resetPassword"   ,resetPassword)


module.exports = router