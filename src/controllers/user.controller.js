import { InoteBookUser } from "../models/inoteBookUser.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandle from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Function to generate access and refresh tokens for a user
const generateTokens = async (userId) => {
  try {
    const user = await InoteBookUser.findById(userId);
    const accessToken = user.generateAccessToken(); // Generate access token
    const refreshToken = user.generateRefreshToken(); // Generate refresh token

    user.refreshToken = refreshToken; // Save refresh token to the user
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    return res
      .status(500)
      .json({ message: "something went wrong while generating tokens" });
  }
};

// Controller to handle user registration
const registerUser = asyncHandle(async (req, res) => {
  const { username, password, email } = req.body;

  // Validate required fields
  if ([username, password, email].some((data) => data?.trim() === "")) {
    return res.status(400).json({ user: "Each fields is required" });
  }

  // Check if user already exists
  const existsUser = await InoteBookUser.findOne({
    $or: [{ username }, { email }],
  });

  if (existsUser) {
    return res.status(402).json({ user: "User Already exists" });
  }

  // Check if photo is provided
  const photoLocalPath = req.files?.photo[0].path;

  console.log(photoLocalPath)
  if (!photoLocalPath) {
    return res.status(407).json({ message: "Photo is required" });
  }

  // Upload photo to Cloudinary
  const photo = await uploadOnCloudinary(photoLocalPath);

  if (!photo) {
    return res.status(407).json({ user: "Photo is not Uploaded" });
  }

  // Create a new user
  const userCreated = await InoteBookUser.create({
    username: username.toLowerCase(),
    password,
    email,
    photo: photo.secure_url,
  });

  // Fetch the created user without sensitive fields
  const finalUserCreated = await InoteBookUser.findById(userCreated._id).select(
    "-password -refreshToken"
  );

  if (!finalUserCreated) {
    return res.status(500).json({ user: "user not created" });
  }

  // Send success response
  return res
    .status(200)
    .json(
      new ApiResponse(200, { finalUserCreated }, "successfully Register User")
    );
});

// Controller to handle user login
const loginUser = asyncHandle(async (req, res) => {
  const { email, password } = req.body;
  // Check if user exists with the provided email
  const userFind = await InoteBookUser.findOne({ email });
  
  if (!userFind) {
    return res.status(404).json({ user: "User not found" });
  }
  
  // Verify if the provided password is correct
  const correctPassword = await userFind.isPasswordCorrect(password);
  

  if (!correctPassword) {
    return res.status(401).json({ user: "Invalid Credentials" });
  }

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateTokens(userFind._id);

  // Fetch the logged-in user without sensitive fields
  const loggedUser = await InoteBookUser.findById(userFind._id).select(
    "-password -refreshToken"
  );

  // Set cookie options
  const options = {
    httpOnly: true,
    secure: true,
  };

  // Send success response with tokens and user data
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedUser, accessToken, refreshToken },
        "User Login Successfully"
      )
    );
});

// Controller to handle user logout
const logoutCurrentUser = asyncHandle(async (req, res) => {
  const user = req.user._id;

  // Remove refresh token from the user
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

  // Set cookie options
  const options = {
    httpOnly: true,
    secure: true, // Enable in production (HTTPS only)
  };

  // Clear cookies and send success response
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "logout Successfully"));
});

export { registerUser, loginUser, logoutCurrentUser };
