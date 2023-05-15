const { PostOne, GetId, PutOne, DeleteOne } = require("../Factory/Factory_CRUD")
const M_coupon = require("../model/M_coupon")
const AsyncHandler = require("express-async-handler") 

exports.POST = PostOne(M_coupon)

exports.GET = AsyncHandler(async(req , res)=>{
    const page =  req.query.page * 1 || 1
    const limit = req.query.limit * 1|| 5
    const skip = (page -1) * limit

    const data = await M_coupon.find().limit(limit).skip(skip)
    res.status(200).json({ results:data.length , data })
})


exports.GETID = GetId(M_coupon)


exports.PUT = PutOne(M_coupon)


exports.DELETE = DeleteOne(M_coupon)