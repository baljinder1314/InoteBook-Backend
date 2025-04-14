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
  try {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

inoteBookUser.methods.isPasswordCorrect = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error("Error while comparing passwords");
  }
};

inoteBookUser.methods.generateAccessToken = function () {
  try {
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
  } catch (error) {
    throw new Error("Error while generating access token");
  }
};

inoteBookUser.methods.generateRefreshToken = function () {
  try {
    return jwt.sign(
      {
        _id: this._id,
      },
      process.env.REFRESH_ACCESS_TOKEN,
      {
        expiresIn: process.env.EXPIRE_REFRESH_ACCESS_TOKEN,
      }
    );
  } catch (error) {
    throw new Error("Error while generating refresh token");
  }
};

export const InoteBookUser = mongoose.model("InoteBookUser", inoteBookUser);
