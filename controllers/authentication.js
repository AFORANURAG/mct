require("dotenv").config();
const express = require("express");
const authController = express();
const {User} = require("../models/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
authController.use(express.json());





authController.get("/",(req,res)=>{
    res.json({message:"welcome to userauth router"})
})
authController.post("/login",async(req,res)=>{
const {password,email} = req.body;
let userInDb = await User.findOne({email});

if(userInDb){
    console.log(userInDb,"user from db")
let encryptedpassword = userInDb?.password;
bcrypt.compare(password,encryptedpassword,(err,result)=>{
    if(err){
        console.log(`error while comparing the token`);
      res.status(500).json({message:"error while authenticating",error:err})  
    }else{
    console.log(result)
   let accessToken = jwt.sign({email,userId:userInDb._id},process.env.SECRET_KEY) 
   res.json({message:"login successfull",accessToken}) 
    }
})
}
})



authController.post("/register", async(req,res)=>{
const {email,password,name,dob} = req.body;
// search in the db first

// console.log(req.body)
let isuseralreadyexist = await User.findOne({email: email});
console.log(isuseralreadyexist)
if(!isuseralreadyexist){
    try {
     bcrypt.hash(password,10, async(err,hash)=>{
        if(err){
            console.log(err)
        }else{
            // console.log(hash)
            let query = await User({email,password:hash,name,dob});
await query.save()
res.status(201).json({message:"user account created successfully"})
        }
     })   
    } catch (error) {
        console.log(`error while registering the user :error is ${error}`)
        res.status(500).json({message:"server error"})
    }
}else{
    res.status(400).json({message:"user already exists"})
}
})



module.exports = {authController}