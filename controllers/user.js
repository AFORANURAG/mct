require("dotenv").config();
const express = require("express");
const {validator} = require("../middlewares/validator");
const UserController = express();
const {User,Post} = require("../models/model");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
UserController.get("/",validator,async (req,res)=>{
  try {
    let allusers = await User.find({});
    res.status(200).json(allusers); 
  } catch (error) {
    console.log(`errro while loading all the users :error is ${error}`)
    res.status(500).json({message:"server error , please try again later"});
  } 
})
UserController.post("/:id/friends",validator,async(req,res)=>{
let friendid = req.params.id;
let userid = req.body.id;
if(friendid&&userid){
try{
let addrequest = await User.findByIdAndUpdate({_id:friendid},{$push:{friendRequests:userid}});
res.status(201).json({message:"friend request send successfully"});
}
catch(err){
console.log(`error while sending friend request:error is ${err}`);
}

}
else{
    res.status(400).json({message:"invalid friendid"});
} 

})

UserController.get("/:id/friends",async(req,res)=>{
  let id = req.params.id;
if(id){
try {
    let friendList = await User.aggregate([{$match:{_id:new mongoose.Types.ObjectId(id)}},{$lookup:{
        from:"users",foreignField:"_id",localField:"friends",as:"friend"
    }}])
    res.status(200).json({friendList});
} catch (error) {
    console.log(`error while loading the friendlist ${error}`);
    res.status(500).json({message:"server error please try again later"});
}
  } else{
    res.status(400).json({message:"invalid id"})
  } 
})

UserController.patch("/:friendid/friends",validator,async (req,res)=>{
// lets say you got a request, so you pull it from friendrequest and you will push it to friends array 
// basically
// so you as a user can see all request
let friendid = req.params.friendid;
let userid = req.body.id;
try {
    let query = await User.findByIdAndUpdate({_id:userid},{$push:{friends:friendid}});
    await User.findByIdAndUpdate({_id:userid},{$pull:{friendRequests:friendid}});
    res.status(204).json({message:"request accepted successfully"});
} catch (error) {
    console.log(`error while accepting the request:error is ${error}`);
    res.status(500).json({message:"server error"});
}

// so you need your friend id , which is there in the friendrequest
    
})




module.exports = {UserController}