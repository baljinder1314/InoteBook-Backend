import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandle from "../utils/asyncHandler.js";

const registerUser = asyncHandle(async (req, res) => {
    // get  password from req.
    // check password and username is.
    // check user is already exists.
    // check for image.
    // upload to them.
    //create user object - create entry in db

  const { username, password  } = req.body;

  if ([username, password,photo].some((data) => data !== "")) {
    new ApiResponse(400, "username and password is require");
  }


  res.status(200).json({
    message: "ok",
  });
});

export { registerUser };
