import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
export const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb" }));
app.use(cors());
app.use(cookieParser());
