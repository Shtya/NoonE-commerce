const M_user = require("../model/M_user")
const {LayerValidation} = require("./validator")
const {check} = require("express-validator")
const bcrypt = require("bcryptjs")



exports.V_POST = [
    check ("name").notEmpty().withMessage("Name is required")
        .isLength({ min:3}).withMessage("This Is Short Or Long between 3 - 30"),
    check("email").isEmail().withMessage("E-mail Invalid").notEmpty().withMessage("E-mail required")
    .custom(val => 
        M_user.findOne({email:val}).then(res=>{
            if(res) return Promise.reject(new Error("This E-mail already exist"))
        })
    ),
    check("passwordConfirm").notEmpty().withMessage("passwordConfirm required")
    .custom((val , {req}) => {
        if(val !== req.body.password) throw new Error("Password not confirm ")
        return true
    }),
        LayerValidation
]



exports.V_PUT = [

    check("email").optional().isEmail().withMessage("E-mail Invalid")
    .custom(val => 
        M_user.findOne({email:val}).then(res=>{
            if(res) return Promise.reject(new Error("This E-mail already exist"))
        })
    ),
    check("passwordConfirm").notEmpty().withMessage("passwordConfirm required")
    .custom((val , {req}) => {
        if(val !== req.body.password) throw new Error("Password not confirm ")
        return true
    }),
        LayerValidation
]



exports.V_PUTPassword = [

    check("password").notEmpty().withMessage("password required "),
    check("passwordConfirm").notEmpty().withMessage("passwordConfirm required")
    .custom((val , {req}) => {
        if(val !== req.body.password) throw new Error("Password not confirm ")
        return true
    }),
    check("passwordCurrent").notEmpty().withMessage("passwordCurrent required ")
    .custom((val , {req})=>
        M_user.findById(req.params.id).then(async res=>{
            if(! await bcrypt.compare(val , res.password) ){
                return Promise.reject(new Error("password not right "))
            }
        })
    ) ,
        LayerValidation
]