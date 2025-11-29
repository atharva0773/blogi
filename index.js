import dotenv from 'dotenv'
dotenv.config();
import express from "express";
import path from 'path'
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { checkForAuthenticationsCookie } from "./middleware/authentication.js";
import userRoute from './routes/router-user.js'
import blogRouter from './routes/router-blog.js'
import methodOverride from "method-override";


import Blog from "./models/models-blog.js";
const app =  express();

const PORT = process.env.PORT ;
mongoose.connect(process.env.MONGODB_URL)
.then((e)=> console.log("mongoDB is connected"))
.catch((e)=>console.log("mongoDB is not connected"));
app.set('view engine','ejs')
app.set('views',path.resolve('./views'))
app.use(methodOverride("_method"));


app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(checkForAuthenticationsCookie("token"))
app.use(express.static(path.resolve('./public')))



app.get("/", async (req,res)=>{
    const allblogs = await  Blog.find({});
    
    res.render("home",{
        user:req.user,
        blogs:allblogs,
    });

})
app.use('/user',userRoute)
app.use('/blog',blogRouter)
app.listen( PORT ,()=>{
    console.log(`Server started on port ${PORT}`);
})