import mongoose, { Schema } from "mongoose";
const notesSchema = new Schema(
  {
    notesUser: {
      type: Schema.Types.ObjectId,
      ref: "InoteBookUser",
    },
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
  },
  { timestamps: true }
);

export const Notes = mongoose.model("Notes", notesSchema);
