const M_user = require("../model/M_user")
const {LayerValidation} = require("./validator")
const {check} = require("express-validator")
const bcrypt = require("bcryptjs")



exports.V_POST = [

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

