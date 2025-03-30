import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const inoteBookUser = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    photo: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

inoteBookUser.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password =await bcrypt.hash(this.password, 10);
  next();
});

inoteBookUser.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

inoteBookUser.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    }
  );
};
inoteBookUser.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_ACCESS_TOKEN,
    {
      expiresIn: process.env.EXPIRE_REFRESH_ACCESS_TOKEN,
    }
  );
};

export const InoteBookUser = mongoose.model("InoteBookUser", inoteBookUser);
