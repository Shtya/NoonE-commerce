const {LayerValidation} = require("./validator")
const {check} = require("express-validator")


exports.V_GET =[
    check("id").isMongoId().withMessage("Invalid Category Id"),
    LayerValidation
]


exports.V_POST = [
    check ("name").notEmpty().withMessage("Name is required")
        .isLength({ min:3}).withMessage("This Is Short Or Long between 3 - 30"),
        LayerValidation
]