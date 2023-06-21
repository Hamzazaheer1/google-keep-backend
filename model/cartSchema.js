const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  Title: {
    type: String,
  },
  Qty: {
    type: Number,
  },
  Price: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const cartSchema = new mongoose.Schema(
  {
    LobbyName: {
      type: String,
      required: true,
    },
    TableNo: {
      type: Number,
      required: true,
    },
    items: [itemSchema],
    Status: {
      type: String,
      enum: ["DINEIN", "TAKEAWAY"],
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
