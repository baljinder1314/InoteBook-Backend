import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import asyncHandle from "../utils/asyncHandler.js";

import "dotenv/config";
import { InoteBookUser } from "../models/inoteBookUser.models.js";
const validateUser = asyncHandle(async (req, res, next) => {
  const userCookie =
    req.cookies.accessToken ||
    req.header("Authorization")?.replace("Bearer", "");

  if (!userCookie) {
    throw new ApiError(402, "Unauthorized request");
  }

  const decodeToken = jwt.verify(userCookie, process.env.ACCESS_TOKEN);

  const user = await InoteBookUser.findById(decodeToken?._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "Invalid Access token");
  }

  req.user = user;

  next();
});

export default validateUser;
