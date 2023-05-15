const M_subcategory = require("../model/M_subcategory")
const AsyncHandler = require("express-async-handler") 


exports.POST = AsyncHandler(async(req , res)=>{
    const data = await M_subcategory.create(req.body)
    res.status(201).json({data})
})

exports.GET = AsyncHandler(async(req , res)=>{
    const page = req.query.page*1 || 1
    const limit = req.query.limit*1 || 10
    const skip = (page -1) * limit

    let obj={}
    if(req.params.cateId) obj={category:req.params.cateId}

    const data = await M_subcategory.find(obj).limit(limit).skip(skip)

    res.status(200).json({results : data.length , page ,data})
})

exports.GETID = AsyncHandler(async(req , res)=>{

    const data = await M_subcategory.findById(req.params.id)

    res.status(200).json({data})
})

exports.PUT = AsyncHandler(async(req , res , next)=>{

    const data = await M_subcategory.findByIdAndUpdate(req.params.id , req.body , {new : true})
    res.status(200).json({data})
})

exports.DELETE = AsyncHandler(async(req , res)=>{

    const data = await M_subcategory.findByIdAndDelete(req.params.id)

    res.status(202).json({msg : "success"})
})