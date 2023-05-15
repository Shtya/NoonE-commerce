const M_product = require("../model/M_product")
const AsyncHandler = require("express-async-handler") 
const ApiFeatures = require("../Factory/ApiFiltering")
const Factory= require("../Factory/Factory_CRUD")
const multer = require("multer")
const sharp = require("sharp")


const multerStorage = multer.memoryStorage();
    const Filter = (req, file, cb) => {
    if (file.mimetype.startsWith('image'))  cb(null, true);
    else cb(new Error('only images allowed'), false);
    };

    const upload = multer({ storage: multerStorage, fileFilter: Filter });

    exports. ImgFields = upload.fields([
    { name: 'imgCover', maxCount: 1 },
    { name: 'imgs', maxCount: 5 },
    ]);
    
    exports.ResizeImg =  AsyncHandler(async (req , res , next)=>{
        if(req.files.imgCover){
            const filename = `product-${Date.now()}-cover.jpeg`;
            await sharp(req.files.imgCover[0].buffer)
              .toFile(`uploads/product/${filename}`); // write into a file on the disk
            req.body.imgCover = filename;
        }

        req.body.imgs = []
        if(req.files.imgs){
            await Promise.all(
                req.files.imgs.map(async(e,index)=>{
                    const filename = `products-${Date.now()}-${index + 1}.jpeg`
                    await sharp(e.buffer).toFile(`uploads/product/${filename}`);
                    req.body.imgs.push(filename)
                })
            )
        }

        next()
    })

exports.POST = Factory.PostOne(M_product)

exports.GET = AsyncHandler(async(req , res)=>{

    //  //================== Paginate
    // const page =  req.query.page * 1 || 1
    // const limit = req.query.limit * 1|| 20
    // const skip = (page -1) * limit
    
    //let Query = M_product.find().populate("category","name")
    
    // //================== Filtering 
    // let exception = ["page","limit","sort","fields","keyword"]
    // let CloneQuery = {...req.query}
    // exception.map(e=> delete CloneQuery[e])
    
    // let QueryStr = JSON.stringify(CloneQuery)
    // QueryStr = QueryStr.replace(/\b(gte|lte|lt|gt)\b/g , match => `$${match}`)
    // if(CloneQuery) Query.find(JSON.parse(QueryStr))

    // //================= Sorting
    // if(req.query.sort){
    //     console.log(req.query.sort.split(",").join(" "));
    //     Query = Query.sort(req.query.sort.split(",").join(" "))
    // }

    // //================= Search 
    // if(req.query.keyword){
    //     const query ={}
    //     query.$or = [
    //         {title: {$regex : req.query.keyword,$options:"i" }},
    //         {description : {$regex : req.query.keyword ,$options : "i"}}
    //     ];
    //     Query=Query.find(query)
    // }


    let countDocuments = await M_product.countDocuments();
    let apiFeatures = new ApiFeatures(req.query , M_product.find()).sort().Filter().Search("products").paginate(countDocuments)
    let {QueryApi , paginationResult} = apiFeatures
    const data = await QueryApi

    res.status(200).json({paginationResult , results:data.length , data })
})


exports.GETID = Factory.GetId(M_product , "reviews")


exports.PUT = Factory.PutOne(M_product)


exports.DELETE = Factory.DeleteOne(M_product)
