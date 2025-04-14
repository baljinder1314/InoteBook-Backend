import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./src/routes/user.routes.js";
export const app = express();

app.use(express.static("public"));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb" }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send({
    message: "Success",
  });
});

app.use("/user", userRouter);
