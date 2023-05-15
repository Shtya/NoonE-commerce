const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
    title           : {type:String , required:true , trim:true },
    description     : {type:String , required:true},
    quantity        : {type:String , required:true},
    sold            : {type:Number , default:0},
    quantity        : Number ,
    price           : {type:Number , required:true , trim:true},
    colors          : [String],
    imgCover        : {type:String , required:true},
    imgs            : [String],
    category        : {type:mongoose.Schema.ObjectId , ref:"category" , required:true},
    subcategory     : [{type:mongoose.Schema.ObjectId , ref:"subcategory"}],
    brand           : {type:mongoose.Schema.ObjectId , ref:"brand"},
    ratingsAverage  : {type:Number , min:1 , max:5},
    ratingsQuantity : {type:Number , default : 0},
    priceAfterDiscount:Number,
},{timestamps:true , toJSON : {virtuals : true} , toObject:{virtuals:true}})

Schema.virtual("reviews" ,{
    ref:"review",
    foreignField:"product",
    localField:"_id"
})

Schema.pre(/^find/ , function(next){
    this.populate({path:"category" , select:"name"})
    next()
})


const LinkImg = (doc)=>{
    let imgs = []
    doc.imgs.map((e,index)=>{
        imgs.push(`${process.env.Base_url}/product/${e}`)
    }) 
    doc.imgs = imgs
    
    doc.imgCover = `${process.env.Base_url}/product/${doc.imgCover}`
}

Schema.post("init" , function (doc){
    LinkImg(doc)
})
Schema.post("save" , function (doc){
    LinkImg(doc)
})



module.exports = mongoose.model("product" , Schema)

