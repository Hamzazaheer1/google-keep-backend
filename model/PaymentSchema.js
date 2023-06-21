const mongoose = require("mongoose");

const PaymentMethodSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

const PaymentMethod = mongoose.model("PaymentMethod", PaymentMethodSchema);
module.exports = PaymentMethod;
