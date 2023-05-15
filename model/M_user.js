const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const Schema = new mongoose.Schema({
   name:{type:String , trim:true , required :true},
   email:{type:String , unique:true , required :true , lowercase:true},
   password:{type:String  , required :true },
   phone:String,
   profileImg:String,
   ChangePassword:Date ,
   role:{type:String , enum:["user" , "admin"] , default:"user"},
   passwordResetCode:String ,
   passwordResetExpire : Date ,
   passwordResetverified : Boolean ,
   wishlist:[{type:mongoose.Schema.ObjectId , ref:"product"}],
   addresses:[{
      id: mongoose.Schema.Types.ObjectId,
      alias:String,
      details:String,
      phone:String,
      city:String,
   }]
},{timestamps:true})


Schema.pre("save" ,async function(next){
   if(!this.isModified("password")) return next()
   this.password =await bcrypt.hash(this.password , 12)
   next()
})

Schema.post("init" , function(doc){
   if(doc.profileImg) doc.profileImg = `${process.env.Base_url}/user/${doc.profileImg}`
})
Schema.post("save" , function(doc){
   if(doc.profileImg) doc.profileImg = `${process.env.Base_url}/user/${doc.profileImg}`
})


module.exports = mongoose.model("user" , Schema)

