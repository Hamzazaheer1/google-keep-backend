const mongoose = require("mongoose");

const ExpensesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    expenseClockIn: {
      type: String,
      require: true,
    },
    expenseClockOut: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

const Expenses = mongoose.model("Expenses", ExpensesSchema);
module.exports = Expenses;
