const { PostOne, GetId, PutOne, DeleteOne } = require("../Factory/Factory_CRUD")
const M_brand = require("../model/M_brand")
const AsyncHandler = require("express-async-handler") 

exports.POST = PostOne(M_brand)

exports.GET = AsyncHandler(async(req , res)=>{
    const page =  req.query.page * 1 || 1
    const limit = req.query.limit * 1|| 5
    const skip = (page -1) * limit

    const data = await M_brand.find().limit(limit).skip(skip)
    res.status(200).json({ results:data.length , data })
})


exports.GETID = GetId(M_brand)


exports.PUT = PutOne(M_brand)


exports.DELETE = DeleteOne(M_brand)