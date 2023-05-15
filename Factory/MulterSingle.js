const AsyncHandler = require("express-async-handler") 
const multer = require("multer")
const sharp = require("sharp")



exports. SingleImg =(nameImg)=>{
    const memory = multer.memoryStorage({})
    const Filter = (req , file , next)=> file.mimetype.startsWith("image") ? next(null , true) : next(new Error("Allow upload Image"), false)
    const Upload = multer({storage:memory , fileFilter : Filter})
     return Upload.single(nameImg)
}


exports. Resize = (nameFolder )=> 
    AsyncHandler(async(req , res ,next)=>{
        const filename = `${nameFolder}_${Date.now()}.jpeg`
        if(req.file){
            await sharp(req.file.buffer)
            .resize(400 , 400)
            .toFormat("jpeg")
            .jpeg({quality:100})
            .toFile(`uploads/${nameFolder}/${filename}`)
        }
        req.body.img = filename
        next()
})

//===================================================================================
