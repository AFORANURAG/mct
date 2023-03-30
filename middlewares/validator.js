require("dotenv").config();
const jwt = require("jsonwebtoken");

const validator = (req,res,next)=>{
let accessToken = req.headers?.authorization?.split(" ")[1];
if(accessToken){
    try {
        jwt.verify(accessToken,process.env.SECRET_KEY,(err,decoded)=>{
           if(err){
            res.status(400).json({message:"jwt error",error:err});
        }
        else{
            console.log("decoded object is",decoded)
        req.body.id = decoded.userId;
        req.body.email = decoded.email;
        next();
           }
        }) 
        
        } catch (error) {
           console.log(`error while verifying the token`,error);
           res.json({message:"error verifying the token",error}) 
        }
}else{
    res.status(400).json({message:"wrong token or invalid token"});
}   
}
module.exports = {validator}