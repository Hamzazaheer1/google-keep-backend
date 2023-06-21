const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Must have a title"],
    },
    note: {
      type: String,
      required: [true, "Must have a note"],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model("NOTE", noteSchema);
module.exports = Note;
