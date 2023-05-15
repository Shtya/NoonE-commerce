const {LayerValidation} = require("./validator")
const {check} = require("express-validator")
const M_category = require("../model/M_category")
const M_subcategory = require("../model/M_subcategory")


exports.V_GET =[
    check("id").isMongoId().withMessage("Invalid product Id"),
    LayerValidation
]


exports.V_POST = [

    check("title").isLength({min:3}).withMessage("Must be at least 3 chars").notEmpty().withMessage("product required"),
    check("description").notEmpty().withMessage("product description required"),
    check("quantity").notEmpty().withMessage("product quantity required").isNumeric().withMessage("product quantity must be a number"),
    check("sold").optional().isNumeric().withMessage("product sold must be a number"),
    check("price").notEmpty().withMessage("product price required").isNumeric().withMessage("product price must be a number"),
    check("priceAfterDiscount").optional().toFloat().isNumeric().withMessage("product priceAfterDiscount must be a number"),
    check("colors").optional().isArray().withMessage("colors should be array of string"),
    check("imgCover").notEmpty().withMessage("product imagecover is required"),
    check("imgs").optional().isArray().withMessage("images should be array of string"),
    check("brand").optional().isMongoId().withMessage("Invalid brand Id formate"),
    
    check("category").notEmpty().withMessage("product must be belong to category").isMongoId().withMessage("Invalid category Id formate")
    .custom(val=>
        M_category.findById(val).then((res)=>{
            if(!res) return  Promise.reject(new Error(`No Category for this Id : ${id}`))
        })
        ).withMessage(`No Category for this Id `),
    

    check("subcategory").optional().isMongoId().withMessage("Invalid subcategory Id formate")
    .custom(
        val =>
         M_subcategory.find({_id:{$exists:true , $in : val}}).then(res => {
            if(val.length <1 || val.length != res.length) return Promise.reject("No Subcategory For This Ids")
        })
    )
            
    .custom((val , {req})=>
        M_subcategory.find({category:req.body.category}).then(res=>{
            let subINcate = []
            res.map(e=> subINcate.push(e._id.toString()))
            if(!val.every(e=> subINcate.includes(e))){
                return Promise.reject("These subcategory don't belong to category Id ")
            }            
        })
        ),


    LayerValidation

]

// 645d019cbb47637dcfc38f28
// 645d0125367e277fb82f6092