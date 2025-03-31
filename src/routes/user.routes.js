import express from "express";
import {
  loginUser,
  logoutCurrentUser,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import validateUser from "../middlewares/loginUser.middleware.js";
import {
  addNotes,
  deleteNote,
  fetchAllNotes,
  updateNotes,
} from "../controllers/notes.controller.js";
const userRouter = express.Router();
userRouter.post(
  "/register",
  upload.fields([
    {
      name: "photo",
      maxCount: 1,
    },
  ]),
  registerUser
);

userRouter.post("/login", loginUser);
userRouter.post("/logout", validateUser, logoutCurrentUser);

//Notes Routers
userRouter.get("/fetchNotes", validateUser, fetchAllNotes);
userRouter.post("/addNotes", validateUser, addNotes);
userRouter.patch("/updateNotes/:id", validateUser, updateNotes);
userRouter.delete("/deleteNotes/:id", validateUser, deleteNote);
export { userRouter };
