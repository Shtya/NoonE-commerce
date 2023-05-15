const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
    name:{type:String , unique : true , required:true , minlength:[3,"Too short brand name"]},
    img : String
},{timestamps:true})


Schema.post("init" , function (doc){
    doc.img = `${process.env.Base_url}/brand/${doc.img}`
})
Schema.post("save" , function (doc){
    doc.img = `${process.env.Base_url}/brand/${doc.img}`
})

module.exports = mongoose.model("brand" , Schema)

