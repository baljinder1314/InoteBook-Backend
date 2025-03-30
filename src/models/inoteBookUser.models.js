import mongoose, { Schema } from "mongoose";

const inoteBookUser = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phote: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

export const InoteBookUser = mongoose.model("InoteBookUser", inoteBookUser);
