const express = require("express");
const cors = require("cors")
const app = express();
const {connection} = require("./config/db.config");
const {authController} = require("./controllers/authentication");
const {UserController}=require("./controllers/user");
const {PostsController } = require("./controllers/post")
app.use(express.json());
app.use(cors({
    origin:"*"
}))
app.use("/auth",authController);
app.use("/users",UserController);
app.use("/posts",PostsController);
app.get("/",(req,res)=>{
    res.status(200).json({message:"express application is running"})
})

app.listen(process.env.PORT||8080,async ()=>{
    try {
        await connection;
        console.log("connected to db successfully");
        console.log(`listening on port ${process.env.PORT||8080}`)
    } catch (error) {
       console.log(`error while connecting to the database :error is ${error}`) 
    }
})

