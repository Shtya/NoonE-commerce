const { PostOne, GetId, PutOne, DeleteOne } = require("../Factory/Factory_CRUD")
const M_review = require("../model/M_review")
const AsyncHandler = require("express-async-handler") 

exports.POST = PostOne(M_review)

exports.GET = AsyncHandler(async(req , res)=>{
    const page =  req.query.page * 1 || 1
    const limit = req.query.limit * 1|| 5
    const skip = (page -1) * limit
    let Obj = {}
    if(req.params.productId) Obj = {product : req.params.productId} 



    const data = await M_review.find(Obj).limit(limit).skip(skip).populate("user","name email profileImg")
    res.status(200).json({ results:data.length , data })
})


exports.GETID = GetId(M_review)


exports.PUT = PutOne(M_review)


exports.DELETE = DeleteOne(M_review)