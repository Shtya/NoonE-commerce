const mongoose = require("mongoose")

exports.Dbconnection = ()=>{
    mongoose.connect(process.env.DB_connection)
    .then(con=> console.log(`connect with ${con.connection.host}`))
    .catch(err=> {
    console.error(err);
    process.exit(1)    
    })

}