require("dotenv").config();
const express = require("express");
const {validator} = require("../middlewares/validator");
const PostsController = express();
const {User,Post} = require("../models/model");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

PostsController.get("/",validator,async(req,res)=>{
    try{
let posts = await Post.find({});
res.status(200).json(posts);
    }catch(error){
        console.log(`error while loading the posts from db,error is ${error}`);
        res.status(500).json({message:"server error please try again later"});
    }
})



PostsController.post("/",validator,async(req,res)=>{
let userid = req.body.id;
try {
    let newPost =  new Post({user:userid,...req.body});
    await newPost.save();
    res.status(201).json({message:"Post created successfully"});
} catch (error) {
    console.log(`error while creating post `,error);
    res.status(500).json({message:"server error , please try again later"});
}
})

PostsController.patch("/:id",validator,async(req,res)=>{
    let userid = req.body.id;
    try {
        let newPost =  await Post.findOneAndUpdate({_id:req.params.id,user:userid},req.body);
        res.status(204).json({message:"Post updated successfully"});
    } catch (error) {
        console.log(`error while updating post `,error);
        res.status(500).json({message:"server error , please try again later"});
    }
    })
    
    PostsController.delete("/:id",validator,async(req,res)=>{
        let userid = req.body.id;
        try {
            let newPost =  await Post.findOneAndDelete({_id:req.params.id,user:userid});
            res.status(202).json({message:"Post deleted successfully"});
        } catch (error) {
            console.log(`error while deleting post `,error);
            res.status(500).json({message:"server error , please try again later"});
        }
        })

PostsController.post("/:id/like",validator,async(req,res)=>{
let postid = req.params.id;
let userid = req.body.id;
console.log(`posid is ${userid}`)
if(postid&&userid){
try {
 // so here what you have to do it basically add the userid to like array of the post 
 //akash created the posts , so now anurag will like the post    
 let likedPost = await Post.findByIdAndUpdate({_id:postid},{$push:{likes:userid}});
 console.log(likedPost)
 res.status(201).json({message:"liked successfully"});
} catch (error) {
console.log(`error while liking the post , post is ${error}`);
res.status(500).json({message:"server error while liking the post, please try again later"});
}



}else{
    res.status(400).json({message:"invalid post id"})
}

})

PostsController.post("/:id/comment",validator,async(req,res)=>{
    let postid = req.params.id;
    let userid = req.body.id;
    console.log(`posid is ${userid}`)
    if(postid&&userid){
    try {
     // so here what you have to do it basically add the userid to like array of the post 
     //akash created the posts , so now anurag will like the post    
     let likedPost = await Post.findByIdAndUpdate({_id:postid},{$push:{comments:{user:userid,...req.body} }});
     console.log(likedPost)
     res.status(201).json({message:"commented successfully"});
    } catch (error) {
    console.log(`error while commenting the post , post is ${error}`);
    res.status(500).json({message:"server error while commenting the post, please try again later"});
    }
    }else{
        res.status(400).json({message:"invalid post id"})
    }
    })
    
    PostsController.get("/:id",validator,async(req,res)=>{
        let postid = req.params.id;
        let userid = req.body.id;
      console.log(postid,userid)  
    if(postid&&userid){
try {
let post = await Post.aggregate([{$match:{_id:new mongoose.Types.ObjectId(postid)}},{$lookup:{from:"users",foreignField:"_id",localField:"user",as:"post creator"}}])
res.status(200).json({post});
} catch (error) {
console.log(`error while loading the posts`,error);
res.status(500).json({message:"server error please try again later"})
}

    }else{
        res.status(400).json({message:"invalid postid"})
    }
        
    })



module.exports = {PostsController};
