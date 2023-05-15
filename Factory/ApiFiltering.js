class ApiFeatures {

    constructor(query ,QueryApi){
        this.query = query
        this.QueryApi = QueryApi
    }


    Filter (){
        let exception = ["page","limit","sort","fields","keyword"]
        let CloneQuery = {... this.query}
        exception.map(e=> delete CloneQuery[e])
        
        let QueryStr = JSON.stringify(CloneQuery)
        QueryStr = QueryStr.replace(/\b(gte|lte|lt|gt)\b/g , match => `$${match}`)

        if(CloneQuery) this.QueryApi.find(JSON.parse(QueryStr))
        return this
    }

    sort (){
        if(this.query.sort){
            this.QueryApi = this.QueryApi.sort(this.query.sort.split(",").join(" "))
        }
        return this
    }

    Search (modelname){
        if(this.query.keyword){
            let query ={}
            if(modelname === "products"){
                query.$or = [
                    {title: {$regex : this.query.keyword,$options:"i" }},
                    {description : {$regex : this.query.keyword ,$options : "i"}}
                ];    
            }else query= {name : {$regex : this.query.keyword ,$options : "i"}}
            
            this.QueryApi =this.QueryApi.find(query)
        }
        return this
    }

    paginate (countDocuments){
        const page =  this.query.page * 1 || 1
        const limit = this.query.limit * 1|| 20
        const skip = (page -1) * limit

        const pagination = {
            currentPage : page,
            limit : limit ,
            numberOfPages : Math.ceil(countDocuments /limit )
        }
    
        this.QueryApi = this.QueryApi.find().limit(limit).skip(skip)
        this.paginationResult = pagination
        return this
    }
}

module.exports = ApiFeatures