const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
    name:{type:String , unique : true , required:true , minlength:[3,"Too short category name"]},
    img : String
},{timestamps:true})

Schema.post("init" , function (doc){
    if(doc.img)doc.img = `${process.env.Base_url}/category/${doc.img}`
})

Schema.post("save" , function (doc){
    if(doc.img)doc.img = `${process.env.Base_url}/category/${doc.img}`
})

module.exports = mongoose.model("category" , Schema)

