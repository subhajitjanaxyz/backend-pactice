import { app } from "./app.js";
import connectDB from "./db/index.js";
import 'dotenv/config'
import { User } from "./models/user.model.js";
// require('dotenv').config();



connectDB().then(()=>{
app.listen(process.env.PORT ,()=>{
    console.log("server is running ",process.env.PORT)
})




}).catch((err)=>{
console.log("mongodb connection error !!!!",err)
})




//test

// const user = await User.findOne({

//     $or: [{username:"admin"}, {email:"admin"}]
// })
// console.log(user.generateAccessToken())   