import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./src/routes/user.routes.js";
export const app = express();

app.use(express.static("public"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb" }));
app.use(cors());
app.use(cookieParser());


app.use("/user",userRouter)