const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
