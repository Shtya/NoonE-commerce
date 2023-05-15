const M_cart = require("../model/M_cart")
const M_order = require("../model/M_order")
const M_product = require("../model/M_product")
const stripe = require("stripe")("sk_test_51MegNnIlxFD1sVSUAMhZkes39gzB51hDstqwOnMiZylSOdsG9vFj1vebmFoRLu4AL0dRaZ9aDPZx5bbnpZHYTdWB00xfYzPV7v")
const AsyncHandler = require("express-async-handler") 
const M_user = require("../model/M_user")


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
        totalOrderPrice : orderPrice,
        paidAt:Date.now(),
        paymentmethodType : "card"
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
})

exports.GetAllOrder = AsyncHandler(async(req , res , next)=>{
    const order = await M_order.find()
    res.status(200).json({result :order.length , data : order})
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

//     // Check Payed
    const createCartOrder = async (session) => {
    const cartId = session.client_reference_id
    const shippingAddress = session.metadata
    const totalOrderPrice = session.amount_total / 100;
    const cart = await M_cart.findById(cartId)
    const user = await M_user.findOne({ email: session.customer_email })
    
    const order = await M_order.create({
      user: user._id,
      cartItems: cart.cartItems,
      shippingAddress,
      totalOrderPrice,
      isPaid: true,
      paidAt: Date.now(),
      paymentmethodType: "card"
    })
  
    if (order) {
      const bulkOption = cart.cartItems.map(item => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
        }
      }))
      await M_product.bulkWrite(bulkOption, {})
      await M_cart.findByIdAndDelete(cartId)
  
    }
     }
  
  exports. webhookCheckout = AsyncHandler((req, res , next) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, "whsec_g4DuFQVenm7yCqjHMuAMWOkAIwpCENTu");// EndPoint Secret Key
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Handle the event
    if (event.type === "checkout.session.completed") {
      createCartOrder(event.data.object)
    }
  
    // Return a 200 res to acknowledge receipt of the event
    res.status(201).json({reseved : true});
  })