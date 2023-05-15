const { PostOne, GetId, PutOne, DeleteOne } = require("../Factory/Factory_CRUD")
const M_user = require("../model/M_user")
const AsyncHandler = require("express-async-handler") 


exports.POST = AsyncHandler(async(req , res)=>{

    const data = await M_user.findByIdAndUpdate(
        req.user._id,
        {$addToSet:{wishlist : req.body.product}},
        {new : true}
        )

    res.status(200).json({ results:data.wishlist.length , wishlist : data.wishlist })
})

exports.DELETE = AsyncHandler(async(req , res)=>{

    const data = await M_user.findByIdAndUpdate(
        req.user._id,
        {$pull:{wishlist : req.params.productId}},
        {new : true}
        )

    res.status(200).json({ results:data.wishlist.length , wishlist : data.wishlist })
})

exports.GET = AsyncHandler(async(req , res)=>{

    const data = await M_user.findById(req.user._id).populate("wishlist")

    res.status(200).json({ results:data.wishlist.length , wishlist : data.wishlist })
})


