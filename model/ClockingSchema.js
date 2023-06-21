const mongoose = require("mongoose");

const ClockingSchema = new mongoose.Schema({
  startDateTime: {
    type: Date,
  },
  endDateTime: {
    type: Date,
  },
  status: {
    type: Boolean,
    default: false,
    required: [true, "Must have a status"],
  },
});

const Clocking = mongoose.model("Clocking", ClockingSchema);
module.exports = Clocking;
