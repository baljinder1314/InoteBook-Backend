import cloudinary from "cloudinary";
import "dotenv/config";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadOnCloudinary = async (localPath) => {
  try {
    if (!localPath) return null;
    const uploadResult = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localPath);
    return uploadResult;
  } catch (error) {
    fs.unlinkSync(localPath);
    return null;
  }
};
