const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  dob: Date,
  bio: String,
  posts: [{ type: mongoose.Types.ObjectId, ref: 'Post' }],
  friends: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  friendRequests: [{ type: mongoose.Types.ObjectId, ref: 'User' }]
})
const commentsSchema = mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User' },
  text: String,
},{timestamps: {
  createdAt: 'created_at'
}})

const postSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Types.ObjectId, ref: 'User' },
        text: String,
        image: String,
        likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
        comments: [commentsSchema]
      },
      {timestamps:true}
)
const User = mongoose.model("user",userSchema);
const Post = mongoose.model("post",postSchema);
module.exports = {User,Post};