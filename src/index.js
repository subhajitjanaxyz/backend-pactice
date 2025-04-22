// import { app } from "./app.js";

//code from app.js file
import express from "express";
// import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from "cors";
const app = express();

import { registerUser } from "./controllers/user.controller.js";
import connectDB from "./db/index.js";

import 'dotenv/config'
connectDB().then(()=>{
app.listen(process.env.PORT || 8000,()=>{
    console.log("server is running ",process.env.PORT)
})
}).catch((err)=>{
console.log("mongodb connection error !!!!",err)
})




// //create basic sever
// import { registerUser } from "./controllers/user.controller.js";
// import express from "express"
// const app=express()
// app.listen(8000,()=>{
//     console.log("server is running ",process.env.PORT)
// })
// app.get("/a/b",registerUser)

// app.js file code
// const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "16kb",
  })
);
// url data manage 
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
// public asset like img etc
app.use(express.static("public"));

// crud oparation on cookie
app.use(cookieParser());




app.get("/a/b",registerUser)