import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      cb(null, "./public/temp");
    } catch (error) {
      cb(new Error("Error setting destination: " + error.message));
    }
  },
  filename: function (req, file, cb) {
    try {
      cb(null, file.originalname);
    } catch (error) {
      cb(new Error("Error setting filename: " + error.message));
    }
  },
});
export const upload = multer({ storage: storage });
