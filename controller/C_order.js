const M_cart = require("../model/M_cart")
const M_order = require("../model/M_order")
const M_product = require("../model/M_product")
const stripe = require("stripe")("sk_test_51MegNnIlxFD1sVSUAMhZkes39gzB51hDstqwOnMiZylSOdsG9vFj1vebmFoRLu4AL0dRaZ9aDPZx5bbnpZHYTdWB00xfYzPV7v")
const AsyncHandler = require("express-async-handler") 


exports.CreateOrder = AsyncHandler(async(req , res , next)=>{

// 1) Get cart depend on CartId
    const cart = await M_cart.findById(req.params.cartId)
    if(!cart) return next(new Error("There is no cart on this id"))

// 2) Get order price depend on cart price "check if coupon apply"
    const orderPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice

// 3) create order with default payment Method type cash
    const order = await M_order.create({
        user : req.user._id ,
        cartItems : cart.cartItems ,
        shippingAddress : req.body.shippingAddress ,
        totalOrderPrice : orderPrice
    })

    if(order){
        // 4) After creating order , decrement quantity , increment solid
        // bulkWrike => do more operation on model
        await M_product.bulkWrite(cart.cartItems.map(e=>({
            updateOne : {
                filter : {_id : e.product},
                update:{$inc : {quantity : -e.quantity , solid : +e.quantity}}

            }
        })))

        // 5) clear cart depend on cartId
        await M_cart.findByIdAndDelete(req.params.cartId)

    }

    res.status(200).json({data : order})
})

exports.GetAllOrder = AsyncHandler(async(req , res , next)=>{
    const order = await M_order.find()
    res.status(200).json({data : order})
})

exports.GetIdOrder = AsyncHandler(async(req , res , next)=>{
    const order = await M_order.findOne({_id:req.params.orderId} )
    res.status(200).json({data : order})
})


exports.IsPaid = AsyncHandler(async(req , res , next)=>{
    const order = await M_order.findById(req.params.orderId)
    if(!order)return next(new Error("There is no order for this id"))

    order.isPaid = true
    order.paidAt = Date.now()

    const  updateOrder = await order.save()
    res.status(200).json({data : updateOrder})
})


exports.IsDeliver = AsyncHandler(async(req , res , next)=>{
    const order = await M_order.findById(req.params.orderId)
    if(!order)return next(new Error("There is no order for this id"))

    order.isDelivered = true
    order.deliveredAt = Date.now()

    const  updateOrder = await order.save()
    res.status(200).json({data : updateOrder})
})

exports.Session = AsyncHandler(async(req , res , next)=>{

    // 1) Get cart depend on CartId
        const cart = await M_cart.findById(req.params.cartId)
        if(!cart) return next(new Error("There is no cart on this id"))
    
    // 2) Get order price depend on cart price "check if coupon apply"
        const orderPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalCartPrice
    
    // 3) Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
        line_items: [{
          price_data :{
            product_data :{name: req.user.name},
            unit_amount: orderPrice * 100,
            currency: 'egp'
        },
          quantity:1
        }],
        mode: "payment",
        success_url:`${req.protocol}://${req.get("host")}/order`,
        cancel_url: `${req.protocol}://${req.get("host")}/cart`,
        customer_email: req.user.email,
        client_reference_id: req.params.id,
        metadata:req.body.shippingAddress
      })
      res.status(200).json({session})
    
})