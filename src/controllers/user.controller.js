import { InoteBookUser } from "../models/inoteBookUser.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandle from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateTokens = async (userId) => {
  try {
    const user = await InoteBookUser.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "something went wrong while generating tokens");
  }
};
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

const loginUser = asyncHandle(async (req, res) => {
  // password & email --> req.body
  // check user exists or not.
  // check password is correct?
  // Generate Tokens
  // send cookies
  // send response.

  const { email, password } = req.body;

  const userFind = await InoteBookUser.findOne({ email });

  if (!userFind) {
    throw new ApiError(404, "User not found with this email");
  }

  const correctPassword = userFind.isPasswordCorrect(password);

  if (!correctPassword) {
    throw new ApiError(401, "Invalid Credentials");
  }

  const { accessToken, refreshToken } = await generateTokens(userFind._id);

  const loggedUser = await InoteBookUser.findById(userFind._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedUser, accessToken, refreshToken },
        "User Login Succussfully"
      )
    );
});

const logoutCurrentUser = asyncHandle(async (req, res) => {
  const user = req.user._id;
  await InoteBookUser.findByIdAndUpdate(
    user,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true, // Enable in production (HTTPS only)
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "logout Successfully"));
});

export { registerUser, loginUser, logoutCurrentUser };
