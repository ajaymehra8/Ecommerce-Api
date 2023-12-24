const JWT=require("jsonwebtoken");
const userModel = require("../models/userModel");

//protected route token base
const requireSignin=async (req,res,next)=>{
try{
    const decode=JWT.verify(req.headers.authorization,process.env.JWT_Secret);
    req.user=decode;
    next();
}
catch(error){
    console.log(error);
}
}

//admin access

const isAdmin=async (req,res,next)=>{
    try{
const user=await userModel.findById(req.user._id);
if(user.role!==1){
    return res.status(401).send({
        success:"false",
        message:"unauthorized access"
    })

}
else{
    next();
}
    }
    catch(error){
        console.log(error);
    }
}


module.exports={requireSignin,isAdmin};