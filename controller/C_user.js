const { PostOne, GetId, PutOne, DeleteOne } = require("../Factory/Factory_CRUD")
const M_user = require("../model/M_user")
const AsyncHandler = require("express-async-handler") 
const multer = require("multer")
const sharp = require("sharp")
const bcrypt = require("bcryptjs")


const memory = multer.memoryStorage({})
//const Filter = (req , file , next)=> file.mimetype.startsWith("image") ? next(null , true) : next(new Error("Allow upload Image"), false)
const Upload = multer({storage:memory })
 
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







exports.POST = PostOne(M_user)


exports.GET = AsyncHandler(async(req , res)=>{
    const countDecoument = await M_user.countDocuments()
    const page =  req.query.page * 1 || 1
    const limit = req.query.limit * 1|| 5
    const skip = (page -1) * limit

    const data = await M_user.find().limit(limit).skip(skip)
    res.status(200).json({ results:data.length,countOfPages:Math.ceil(countDecoument/limit) , data })
})


exports.PUT = AsyncHandler(async(req , res , next)=> {
    const {email , name , phone , role , profileImg} = req.body
    const data = await M_user.findByIdAndUpdate(req.params.id , { profileImg,email , name , phone , role} , {new:true})
    if(!data) return next(new Error (`No Data on this Id `)) 
    res.status(200).json({data})
})


exports.PUTPassword = AsyncHandler(async(req , res , next)=> {
    const {password} = req.body
    const data = await M_user.findByIdAndUpdate(
        req.params.id ,
        {password : await bcrypt.hash(password ,12) , ChangePassword : Date.now()}
        , {new:true})

    if(!data) return next(new Error (`No Data on this Id `)) 
    res.status(200).json({data})
})


exports.GETID = GetId(M_user)


exports.DELETE = DeleteOne(M_user)