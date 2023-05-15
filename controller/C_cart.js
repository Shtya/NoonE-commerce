const { PostOne, GetId, PutOne, DeleteOne } = require("../Factory/Factory_CRUD")
const M_cart = require("../model/M_cart")
const M_product = require("../model/M_product")
const M_coupon = require("../model/M_coupon")
const AsyncHandler = require("express-async-handler") 

const EditeTotalPrice = (cart)=>{
    let totalprice = 0;
    cart.cartItems.map(e=> totalprice += e.quantity * e.price)
    cart.totalCartPrice = totalprice
    return totalprice
}

exports.AddCart = AsyncHandler(async(req , res)=>{

    const {productId , color } = req.body
    const product = await M_product.findById(productId)

    // ===========>> Get Cart For logged user
    let cart = await M_cart.findOne({user : req.user._id})

    // ===========>> if not exist , create cart
    if(!cart){

         cart = await M_cart.create({
            user : req.user._id ,
            cartItems :[{ product :productId , color , price: product.price}]
        })

    }else{

        // product exist in cart =>  update product quantity
        const productIndex = cart.cartItems.findIndex(item => item.product.toString() === productId && item.color ===color)

        if(productIndex > -1){
            const cartItem = cart.cartItems[productIndex]
            cartItem.quantity +=1 ;
            cart.cartItems[productIndex] = cartItem

        }else{
            cart.cartItems.push({ product :productId , color , price: product.price})
        }

        // calculate total cart priceAfter
        let totalprice = 0;
        cart.cartItems.map(e=> totalprice += e.quantity * e.price)
        cart.totalCartPrice = totalprice
    }

    res.json({data : cart})
    await cart.save()
})


exports.GetCart = AsyncHandler(async(req , res , next)=>{
    const cart = await M_cart.findOne({user :req.user._id})
    if(!cart) next(new Error ("there is cart for this user"))
    res.status(200).json({ countCart: cart.cartItems.length  ,data:cart})

})

exports.DeleteCart = AsyncHandler(async(req , res , next)=>{
    const cart = await M_cart.findOneAndUpdate(
        {user : req.user._id},
        {$pull : {cartItems:{_id : req.params.productId}}},
        {new :true}
        )
    if(!cart) next(new Error ("there is cart for this user"))
    EditeTotalPrice(cart)
    res.status(200).json({ countCart: cart.cartItems.length  ,data:cart})

})

exports.DeleteAllCart = AsyncHandler(async(req , res , next)=>{
    const cart = await M_cart.findOneAndDelete(
        {user : req.user._id}
        )
    if(!cart) next(new Error ("there is cart for this user"))
    res.status(200).json({ Status : "Success Deleted"})

})

exports.PUTQuantity = AsyncHandler(async(req , res , next)=>{
    const cart = await M_cart.findOne({user : req.user._id})
    const productIndex = cart.cartItems.findIndex(item => item._id.toString() === req.params.productId)
    let cartItem = cart.cartItems[productIndex]
    cartItem.quantity = req.body.quantity
    EditeTotalPrice(cart)

    if(!cart) next(new Error ("there is cart for this user"))
    await cart.save()
    res.status(200).json({data : cart})

})


exports.ApplyCoupon = AsyncHandler(async(req , res , next)=>{
    // 1) Get coupon based on coupon name
    const coupon = await M_coupon.findOne({name : req.body.name , expire : {$gt : Date.now()}})
    if(!coupon) next(new Error("there is no coupon with this name"))

    // 1) Get logged user cart to get total cart
    const cart = await M_cart.findOne({user : req.user._id})
    const totalPrice = EditeTotalPrice(cart)
    const totalPriceAfterDiscount =  totalPrice - ((totalPrice * coupon.discount) / 100)
    
    cart.totalPriceAfterDiscount = totalPriceAfterDiscount
    await cart.save()
    res.status(200).json({data : cart })
})
