const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
    name:{type:String , unique : true , required:true , trim:true},
    expire:{type:Date , required:true },
    discount:{type:Number , required:true },
},{timestamps:true})


module.exports = mongoose.model("coupon" , Schema)

