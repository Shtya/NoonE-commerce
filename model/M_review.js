const mongoose = require("mongoose")
const M_product = require("./M_product")

const Schema = new mongoose.Schema({
    title:String ,
    ratings : {type:Number , min:1 , max:5 , required:true},
    user : {type : mongoose.Schema.ObjectId , ref:"user" , required:true},
    product : {type : mongoose.Schema.ObjectId , ref:"product" , required:true},
},{timestamps:true})


Schema.statics.CalcAverageRatingsAndQuantity = async function(productId){
    const result = await this.aggregate([
        // stage 1 : get all reviews in specific product
        {$match : {product : productId}},
        {$group : {_id : "product" ,ratingsQuantity:{$sum:1} , ratingsAverage:{$avg:"$ratings"} }}
    ])

    if(result.length > 0){
    await M_product.findByIdAndUpdate(productId ,
        {
            ratingsQuantity:result[0].ratingsQuantity,
            ratingsAverage: result[0].ratingsAverage
        }
     , {new : true})
    }
}


Schema.post("save" , async function(){
    await this.constructor.CalcAverageRatingsAndQuantity(this.product)
})

Schema.post("remove" , async function(){
    await this.constructor.CalcAverageRatingsAndQuantity(this.product)
})


module.exports = mongoose.model("review" , Schema)

