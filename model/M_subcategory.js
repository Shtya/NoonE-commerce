const mongoose =  require("mongoose")


const Schema = new mongoose.Schema({

    name:{type:String , trim : true , unique:[true , "subcategory must be unique"]},
    category:{type : mongoose.Schema.ObjectId , ref:"category" , required:true}

},{timestamps:true})

module.exports = mongoose.model("subcategory" , Schema)