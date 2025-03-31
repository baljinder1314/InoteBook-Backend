import { Notes } from "../models/notes.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandle from "../utils/asyncHandler.js";

const fetchAllNotes = asyncHandle(async (req, res) => {
  const notes = await Notes.find({ user: req.user._id });
  return res.json(notes);
});

const addNotes = asyncHandle(async (req, res) => {
  // get the imformation from the user.
  // check each feilds is fullfilled.
  // add the mongoose.
  // send the response.
  const user = req.user._id;
  const { title, description, tags } = req.body;

  if ([title, description].some((data) => data?.trim() === "")) {
    throw new ApiError(402, "title and description is requrired");
  }

  const userNotes = await Notes.create({
    user: user,
    title,
    description,
    tags: tags || "",
  });

  if (!userNotes) {
    throw new ApiError(500, "Notes are not added");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, userNotes, "Notse added succussfully"));
});

const updateNotes = asyncHandle(async (req, res) => {
  const { title, description, tags } = req.body;

  const { id } = req.params;
  
  if ([title, description].some((data) => data?.trim() === "")) {
    return res.json({ message: "title and descritption is required" });
  }



  const updateNote = await Notes.findByIdAndUpdate(
    {
      _id: id,
      user: req.params._id,
    },
    {
      $set: {
        title,
        description,
        tags: tags || "",
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { updateNote }, "Note Updated successfully"));
});


export { fetchAllNotes, addNotes, updateNotes };
