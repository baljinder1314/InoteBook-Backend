import { Notes } from "../models/notes.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandle from "../utils/asyncHandler.js";

// Fetch all notes for the logged-in user
const fetchAllNotes = asyncHandle(async (req, res) => {
  const notes = await Notes.find({ user: req.user._id });
  return res.json(notes);
});

// Add a new note for the logged-in user
const addNotes = asyncHandle(async (req, res) => {
  const user = req.user._id;
  const { title, description, tags } = req.body;

  // Validate that title and description are not empty
  if ([title, description].some((data) => data?.trim() === "")) {
    return res
      .status(402)
      .json({ message: "title and description is required" });
  }

  // Create a new note in the database
  const userNotes = await Notes.create({
    user: user,
    title,
    description,
    tags: tags || "",
  });

  // Check if the note was successfully created
  if (!userNotes) {
    return res.status(500).json({ message: "Notes are not added" });
  }

  // Return a success response with the created note
  return res
    .status(200)
    .json(new ApiResponse(200, userNotes, "Notes added successfully"));
});

// Update an existing note for the logged-in user
const updateNotes = asyncHandle(async (req, res) => {
  const { title, description, tags } = req.body;
  const { id } = req.params;

  // Validate that title and description are not empty
  if ([title, description].some((data) => data?.trim() === "")) {
    return res.json({ message: "title and description is required" });
  }

  // Find the note by ID and update it
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
      new: true, // Return the updated document
      runValidators: true, // Run validation on the updated fields
    }
  );

  // Return a success response with the updated note
  return res
    .status(200)
    .json(new ApiResponse(200, { updateNote }, "Note updated successfully"));
});

// Delete a note for the logged-in user
const deleteNote = asyncHandle(async (req, res) => {
  const { id } = req.params;

  console.log(id, req.user._id);

  // Find the note by ID and delete it
  const deleteNotes = await Notes.findByIdAndDelete({
    _id: id,
    user: req.user._id,
  });

  // Check if the note was successfully deleted
  if (!deleteNotes) {
    return res.status(404).json({ message: "Note not found." });
  }

  // Return a success response with the deleted note
  return res
    .status(200)
    .json(new ApiResponse(200, deleteNotes, "Note deleted successfully"));
});

export { fetchAllNotes, addNotes, updateNotes, deleteNote };
