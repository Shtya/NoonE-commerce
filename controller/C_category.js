const M_category = require("../model/M_category")
const AsyncHandler = require("express-async-handler") 
const { PostOne, GetId, PutOne, DeleteOne } = require("../Factory/Factory_CRUD")




exports.POST = PostOne(M_category)

exports.GET = AsyncHandler(async(req , res)=>{
    const page =  req.query.page * 1 || 1
    const limit = req.query.limit * 1|| 5
    const skip = (page -1) * limit

    const data = await M_category.find().limit(limit).skip(skip)
    res.status(200).json({ results:data.length , data })
})


exports.GETID = GetId(M_category)


exports.PUT = PutOne(M_category)


exports.DELETE = DeleteOne(M_category)
