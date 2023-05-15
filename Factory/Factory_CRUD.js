const AsyncHandler = require("express-async-handler")

exports. DeleteOne = Model =>

    AsyncHandler(async(req , res , next)=> {
        const data = await Model.findByIdAndDelete(req.params.id )
        if(!data) return next(new Error (`No Data on This Id`))
        res.status(201).send("success")
    })


exports.PutOne = Model => 
    AsyncHandler(async(req , res , next)=> {
        const data = await Model.findByIdAndUpdate(req.params.id , req.body , {new:true})
        if(!data) return next(new Error (`No Data on this Id `)) 
        data.save()
        res.status(200).json({data})
    })

exports.PostOne = Model => 
    AsyncHandler(async(req , res)=> {
        const data = await Model.create(req.body)
        res.status(201).json({data})
    })


exports.GetId = (Model , optionPopulate)=> 
    AsyncHandler(async(req , res , next)=> {

        let query = Model.findById(req.params.id)
        if(optionPopulate) query = query.populate(optionPopulate)


        const data = await query
        if(!data) return next(new Error (`ID isn't Found here ${req.params.id} `))
        res.status(200).json({data})
    })