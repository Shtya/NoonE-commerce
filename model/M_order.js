const mongoose = require("mongoose")
const Schema = new mongoose.Schema({
  user              : {type : mongoose.Schema.ObjectId , ref:"user" , required:true},
  cartItems         : [{
      product : { type: mongoose.Schema.ObjectId, ref: "product" },
      quantity: Number,
      color   : String,
      price   : Number 
  }],
  taxPrice          : { type: Number, default: 0 },
  shippingPrice     : {type:Number , default:0},
  paymentmethodType : {type:String , enum:["cash" , "card"] , default:"cash"},
  totalOrderPrice   : Number ,
  isPaid            : {type:Boolean , default:false},
  paidAt            : Date,
  isDelivered       : {type:Boolean , default:false},
  deliveredAt       : Date,
  shippingAddress: {
    details:String  ,
    phone:String    ,
    city:String     ,
    postalCode:String ,
  }
})

Schema.pre( /^find/ , async function(next){
  this.populate("user" , "name email profileImg")
  this.populate("cartItems.product")
  next()
})


module.exports = mongoose.model("order", Schema)
