const mongoose=require("mongoose");
const orderSchema=new mongoose.Schema({
products:[{
    type:mongoose.ObjectId,
    ref:"products"
}],
payment:{

},
buyer:{
    type:mongoose.ObjectId,
    ref:"users"
},
statue:{
    type:String,
    default:"Not process",
    enum:['Not process',"Processing","Shipped","Delivered","Cancelled"]
},
},{timestamps:true})
module.exports=mongoose.model("Order",orderSchema);