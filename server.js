const path = require("path")

const cors = require("cors")
const compression = require("compression")
const express = require("express")
const dotenv = require("dotenv").config({path:".env"})
const app = express()
const morgan = require("morgan")
const {Dbconnection} = require("./config/Dbconnection")
const ApiError = require("./utils/ApiError")
const { mountenRoutes } = require("./routes")
const { webhookCheckout } = require("./controller/C_order")
Dbconnection()



app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname,"uploads")))

app.use(morgan("dev"))
app.use(cors())
app.options("*" , cors())
app.use(compression())
mountenRoutes(app)

app.use("/webhook-checkout" , express.raw({type:"application/json"} , webhookCheckout))



app.all("*" , (req ,res , next)=>{
    //const err = new Error(`Can't find this route : ${req.originalUrl}`)
    next(new ApiError(`Can't find this route : ${req.originalUrl}`,400))
})
app.use((err , req , res , next)=>{
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"

    res.status(err.statusCode).json({
        status : err.status,
        error : err ,
        message : err.message ,
        stack : err.stack
    })
})

const port = process.env.PORT
app.listen(port , _=> console.log(`connect on port ${port}`))


// Events => For catch any error don't make for him handle error 
process.on("unhandledRejection" , (err)=>{
    console.error(`UnhandledRejection ${err}`)
    process.exit(1)
})