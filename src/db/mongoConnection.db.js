import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { PROJECT_NAME } from "../../constant.js";
import "dotenv/config";

const mongooseConnection = async () => {
  try {
    await mongoose.connect(`${process.env.MONGOOSE_URL}/${PROJECT_NAME}`);
    console.log(`Mongoose Connect Successfully`);
  } catch (error) {
    new ApiError(500, "Mongoose Connection Error");
  }
};

export default mongooseConnection;
