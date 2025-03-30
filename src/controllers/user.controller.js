import { InoteBookUser } from "../models/inoteBookUser.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandle from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandle(async (req, res) => {
  // get  password from req.
  // check password and username is.
  // check user is already exists.
  // check for image.
  // upload to them.
  //create user object - create entry in db
  // remove password and refresh token fields in response.
  //check for user creation
  //return response

  const { username, password, email } = req.body;

  if ([username, password, email].some((data) => data?.trim() === "")) {
    throw new ApiResponse(400, "Each fields is required");
  }

  const existsUser = await InoteBookUser.findOne({
    $or: [{ username }, { email }],
  });

  if (existsUser) {
    throw new ApiError(409, "User Already exists");
  }

  const photoLocalPath = req.files?.photo[0].path;

  if (!photoLocalPath) {
    throw new ApiError(407, "Photo is required");
  }

  const photo = await uploadOnCloudinary(photoLocalPath);

  if (!photo) {
    throw new ApiError(407, "Photo is not Uploaded");
  }

  const userCreated = await InoteBookUser.create({
    username: username.toLowerCase(),
    password,
    email,
    photo: photo.secure_url,
  });

  const finalUserCreated = await InoteBookUser.findById(userCreated._id).select(
    "-password -refreshToken"
  );

  if (!finalUserCreated) {
    throw new ApiError(500, "user not created");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { finalUserCreated }, "successfully Created User")
    );
});

export { registerUser };
