import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

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
      required: [true, "password is required"],
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

inoteBookUser.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});

inoteBookUser.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const InoteBookUser = mongoose.model("InoteBookUser", inoteBookUser);
