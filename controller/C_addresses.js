const { PostOne, GetId, PutOne, DeleteOne } = require("../Factory/Factory_CRUD")
const M_user = require("../model/M_user")
const AsyncHandler = require("express-async-handler") 

exports.POST = AsyncHandler(async(req , res)=>{

    const data = await M_user.findByIdAndUpdate(
        req.user._id,
        {$addToSet:{addresses : req.body}},
        {new :true}
        )

    res.status(200).json({ results:data.addresses.length , addresses : data.addresses })
})


exports.GET = AsyncHandler(async(req , res)=>{

    const data = await M_user.findById(req.user._id)

    res.status(200).json({ results:data.addresses.length , addresses : data.addresses })
})



exports.DELETE = AsyncHandler(async(req , res)=>{

    const data = await M_user.findByIdAndUpdate(
        req.user._id,
        {$pull:{addresses : {_id : req.params.addressesId}}},
        {new :true}
        )

    res.status(200).json({ results:data.addresses.length , addresses : data.addresses })
})