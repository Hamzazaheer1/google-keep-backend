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
});

const orderSchema = new mongoose.Schema(
  {
    OrderClockIn: {
      type: String,
      require: true,
    },
    OrderClockOut: {
      type: String,
      require: true,
    },
    CustomerName: {
      type: String,
    },
    PhoneNo: {
      type: String,
    },
    Address: {
      type: String,
    },
    LobbyName: {
      type: String,
    },
    TableNo: {
      type: Number,
    },
    TotalPrice: {
      type: Number,
    },
    Status: {
      type: String,
      enum: ["Pending", "PaymentDone", "cancelled"],
    },
    Type: {
      type: String,
      enum: ["DINEIN", "TAKEAWAY"],
    },
    WaiterId: {
      type: String,
    },
    PaymentMethod: {
      type: String,
    },
    OrderItems: [
      {
        items: [itemSchema],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
