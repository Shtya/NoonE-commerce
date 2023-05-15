const crypto = require("crypto")

const M_user = require("../model/M_user")
const AsyncHandler = require("express-async-handler") 
const multer = require("multer")
const sharp = require("sharp")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const SendEmail = require("../utils/SendEmail")
const memory = multer.memoryStorage({})
const Upload = multer({storage:memory })


const {Jwt_secret_key , Jwt_expire_in} = process.env
const Token = (payload)=> jwt.sign({userId : payload._id} ,Jwt_secret_key , {expiresIn : Jwt_expire_in})

exports.Img =  Upload.single("profileImg")

exports. Resize = AsyncHandler(async(req , res ,next)=>{
        const filename = `user_${Date.now()}.jpeg`
        if(req.file){
            await sharp(req.file.buffer)
            .resize(400 , 400)
            .toFormat("jpeg")
            .jpeg({quality:100})
            .toFile(`uploads/user/${filename}`)
        }
        req.body.profileImg = filename
        next()
})

exports.Signup = AsyncHandler(async(req , res ,next)=>{
    const data = await M_user.create(req.body)
    const token = Token(data)

    res.status(201).json({data , token})
})

exports.Login = AsyncHandler(async(req , res ,next)=>{
    const data = await M_user.findOne({email : req.body.email})

    if(!data || ! await bcrypt.compare(req.body.password , data.password)){
        return next(new Error("E-mail or Password Incorrect"))
    }

    const token = Token(data)

    res.status(201).json({data , token})
})

exports.protect = AsyncHandler(async(req , res ,next)=>{
    //=========== 1) check if token exist
    let token;
    if(req.headers.authorization) token = req.headers.authorization.split(" ")[1]
    if(!token) next(new Error("you're not login , please login to get access this route"))

    //=========== 2) verify Token 
    const decoded = jwt.verify(token , Jwt_secret_key)

    //=========== 3) Check If User For Token Exist
    const user = await M_user.findById(decoded.userId)
    if(!res) return next(new Error("The user that belong To This token , ")) 

    
    //=========== 4) 
    if(user.ChangePassword){
        const changeToTimeStampe = parseInt(user.ChangePassword.getTime() / 1000)
        console.log(changeToTimeStampe , decoded.iat);
        if(changeToTimeStampe > decoded.iat){
            next(new Error(" user recently changed his password , please login and again access "))
        }
    }

    req.user = user 
    next()

})

exports.allowedTo = (...roles)=>
    AsyncHandler(async(req , res , next)=>{
        if(!roles.includes(req.user.role)) return next(new Error("You're not allow to access this route"))
        next()
    })


exports.ForgotPassword = AsyncHandler(async(req , res , next)=>{
    //=============> 1) Get user with email & if user exist 
    const user = await M_user.findOne({email : req.body.email})
    if(!user) return next(new Error(`There is no user with that email ${req.body.email}`))

    //=============> 2) shave hashedresetpassword & 
    const SixDigits = Math.trunc(Math.random()*1000000).toString()
    const hashedResetPassword = crypto.createHash('sha256').update(SixDigits).digest("hex")

    user.passwordResetCode = hashedResetPassword
    user.passwordResetExpire = Date.now() + 10 * 60 * 1000
    user.passwordResetverified = false
    user.save()

    //==============> 3) send resetCode
    const message = `Hi ${user.name} , \n we received a request to reset the password on you E-shop Account . 
    \n ${SixDigits} \n Enter this code to complete the reset. \n Thanks for helping us keep your acount secure. \n`

    await SendEmail({email:user.email , subject:"Your password reset code (valid for a 10 min)" ,message , })

    res.status(200).json({status : "success"})

})

exports.verifyPassResetCode = AsyncHandler(async(req , res , next)=>{

    const hashedResetCode = crypto.createHash("sha256").update(req.body.resetCode).digest("hex")
    const user = await M_user.findOne({passwordResetCode :hashedResetCode , passwordResetExpire:{$gt : Date.now()} })
    if(!user) return next(new Error("Reset code invalid or expired"))

    user.passwordResetverified = true
    await user.save()
    res.status(200).json({staus:"success"})

})


exports.resetPassword = AsyncHandler(async(req , res , next)=>{

    const user = await M_user.findOne({email : req.body.email})
    if(!user) return next(new Error("there is no user with  email "))
    if(!user.passwordResetverified) return next(new Error("reset code not verified"))

    user.password = req.body.newPassword
    user.passwordResetCode = undefined
    user.passwordResetExpire = undefined
    user.passwordResetverified = undefined
    await user.save()

    const token = Token(user)
    res.status(200).json({token})
})


