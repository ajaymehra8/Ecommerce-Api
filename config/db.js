const mongoose = require("mongoose");
const colors = require("colors");

const connectDB= async()=>{
try{
const conn= await mongoose.connect(process.env.MongoDb_url);
console.log(`Connected to mongo db ${conn.connection.host}`.bgBlack.green);

}
catch(error){
console.log(`Error in mongodb ${error}`.bgMagenta.white);
}
}
module.exports=connectDB;