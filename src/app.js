import express from "express";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from "cors";
const app = express();

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




app.use("/a",userRouter)


export { app };
