const M_review = require("../model/M_review")
const {LayerValidation} = require("./validator")
const {check} = require("express-validator")



exports.V_POST = [

    check("title").optional(),
    check("user").isMongoId().withMessage("user Id Invalid "),
    check("ratings").notEmpty().withMessage("ratings is required"),
    check("product").notEmpty().withMessage("product Id required").isMongoId().withMessage("product Id Invalid")
    .custom((val , {req})=>
        M_review.findOne({user : req.body.user , product : req.body.product}).then(res =>{
            if(res) return Promise.reject(new Error("You already created before review"))
        })
    ),
        LayerValidation
]


exports.V_PUT = [

    check("id").isMongoId().withMessage("Id Invalid")
    .custom((val , {req})=>
        M_review.findById(val).then(res =>{

            if(!res) return Promise.reject(new Error("there is id with user"))
            if(res.user.toString() !== req.user._id.toString()) return Promise.reject(new Error("لا يمكنك التعديل علي هذا التعليق"))
        })
    ),
        LayerValidation
]


exports.V_DELETE = [

    check("id").isMongoId().withMessage("Id Invalid")
    .custom((val , {req})=>
        M_review.findById(val).then(res =>{
            if(!res) return Promise.reject(new Error("there is id with user"))
            if(req.user.role === "user"){
                if(res.user.toString() !== req.user._id.toString()) return Promise.reject(new Error("لا يمكنك  حذف هذا التعليق"))
            }
        })
    ),
        LayerValidation
]

