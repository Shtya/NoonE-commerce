const {check , validationResult} = require("express-validator")

exports. LayerValidation = (req , res , next)=>{

  const err = validationResult(req);
  if(!err.isEmpty()){
      return res.status(400).json({Error:err.array()})
  }
  next()
}
