const mongoose = require("mongoose");

const LobbiesSchema = new mongoose.Schema({
  lobbyName: {
    type: String,
    required: true,
  },
  noOfTables: {
    type: Number,
    required: true,
  },
  Tables: [
    {
      tableNumber: {
        type: Number,
      },
      isBooked: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const Lobby = mongoose.model("Lobby", LobbiesSchema);
module.exports = Lobby;
