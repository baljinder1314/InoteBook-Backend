import mongoose, { Schema } from "mongoose";
const notesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "InoteBookUser",
      required: true,
    },
  },
  { timestamps: true }
);

export const Notes = mongoose.model("Notes", notesSchema);
