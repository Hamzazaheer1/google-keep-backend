require("../db/conn");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const User = require("../model/userSchema");
const Lobby = require("../model/LobbiesSchema");
const Category = require("../model/categorySchema");
const Item = require("../model/itemSchema");
const Clocking = require("../model/ClockingSchema");
const PaymentMethod = require("../model/PaymentSchema");
const Order = require("../model/orderSchema");
const Expenses = require("../model/expenseSchema");

// Lobby
exports.getAllLobbies = factory.getAll(Lobby);
exports.addLobby = catchAsync(async (req, res, next) => {
  const { lobbyName, noOfTables } = req.body;

  if (!lobbyName || !noOfTables) {
    return res.status(422).json({ error: "Please fill the fields properly" });
  }

  const tables = [];
  for (let i = 1; i <= noOfTables; i++) {
    tables.push({ tableNumber: i, isBooked: false });
  }

  const lobby = new Lobby({
    lobbyName,
    noOfTables,
    Tables: tables,
  });

  await lobby.save();
  res.status(201).json({ message: "Lobby added successfully" });
});
exports.updateLobby = catchAsync(async (req, res, next) => {
  const { lobbyId } = req.params;
  const { lobbyName, noOfTables } = req.body;

  if (!lobbyId || !lobbyName || !noOfTables) {
    return res
      .status(422)
      .json({ error: "Please provide lobbyId, lobbyName, and noOfTables" });
  }

  const updatedLobby = await Lobby.findByIdAndUpdate(
    lobbyId,
    {
      lobbyName,
      noOfTables,
    },
    { new: true }
  );

  if (!updatedLobby) {
    return res.status(404).json({ error: "Lobby not found" });
  }

  res
    .status(200)
    .json({ message: "Lobby updated successfully", lobby: updatedLobby });
});
exports.removeLobby = factory.deleteOne(Lobby);

// Category
exports.getAllCategories = factory.getAll(Category);
exports.addCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.removeCategory = factory.deleteOne(Category);

// Items
exports.getAllItems = factory.getAll(Item);
exports.removeItem = factory.deleteOne(Item);
exports.addItem = catchAsync(async (req, res, next) => {
  const { title, description, price, category, categoryId = 2 } = req.body;
  if (!title || !description || !price || !category) {
    return res.status(422).json({ error: "Plz fill the field properly" });
  }
  const photo = req.file.filename;

  const item = new Item({
    title,
    description,
    price,
    categoryId,
    category,
    photo,
  });
  await item.save();
  res.status(201).json({ message: "Item added successfully" });
});
exports.updateItem = catchAsync(async (req, res, next) => {
  const { title, description, price, category } = req.body;
  const photo = req.file.filename;

  const updatedItem = await Item.findByIdAndUpdate(
    req.params.id,
    { title, description, price, category, photo },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      updatedItem,
    },
  });
});

// Waiters
exports.getAllWaiters = catchAsync(async (req, res, next) => {
  const users = await User.find({
    role: { $in: ["WAITER"] },
  })
    .select("-password -tokens")
    .lean();

  if (!users?.length) {
    return res.status(400).json({ message: "No waiters found" });
  }

  res.status(200).json({
    status: "success",
    result: users.length,
    data: users,
  });
});
exports.updateWaiter = factory.updateOne(User);
exports.removeWaiter = factory.deleteOne(User);

// Payment Method
exports.getAllPaymentMethod = factory.getAll(PaymentMethod);
exports.addPaymentMethod = factory.createOne(PaymentMethod);
exports.updatePaymentMethod = factory.updateOne(PaymentMethod);
exports.removePaymentMethod = factory.deleteOne(PaymentMethod);

// Clocking
exports.getAllClockings = catchAsync(async (req, res, next) => {
  const clockings = await Clocking.find().sort({ startDateTime: -1 });

  if (!clockings?.length) {
    return res.status(400).json({ message: "No clockings found" });
  }

  res.status(200).json({
    status: "success",
    result: clockings.length,
    data: clockings,
  });
});
exports.checkIn = catchAsync(async (req, res, next) => {
  const currentDateTime = new Date();

  const newClocking = new Clocking({
    startDateTime: currentDateTime,
    endDateTime: null,
    status: true,
  });

  newClocking.save().then(() => {
    res.status(200).json({ message: "Check-in successful!", newClocking });
  });
});
exports.checkOut = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const clocking = await Clocking.findByIdAndUpdate(
    id,
    { endDateTime: new Date(), status: false },
    { new: true }
  );

  if (!clocking) {
    return res
      .status(404)
      .json({ message: "Clocking not found or already ended." });
  }

  res.status(200).json({ message: "Check-out successful!" });
});

// Completed and Cancelled Orders
exports.getOrderByClockingId = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  let order;

  if (id !== "all") {
    order = await Order.find({
      OrderClockIn: id,
    });
  } else {
    order = await Order.find();
  }

  const completedOrderTotal = order.filter(
    (o) => o.Status === "PaymentDone"
  ).length;
  const canceledOrderTotal = order.filter(
    (o) => o.Status === "cancelled"
  ).length;

  res.status(200).json({
    status: "success",
    data: order,
    completedOrderTotal,
    canceledOrderTotal,
  });
});

// Expenses
exports.updateExpense = factory.updateOne(Expenses);
exports.removeExpense = factory.deleteOne(Expenses);
exports.addExpense = catchAsync(async (req, res, next) => {
  const { title, amount } = req.body;

  if (!title || !amount) {
    return res.status(422).json({ error: "Please fill the fields properly" });
  }

  let clockInDatetime;
  let clockOutDateTime;

  const clocking = await Clocking.find().sort({ startDateTime: -1 }).limit(1);
  if (clocking.length > 0 && clocking[0].status === true) {
    clockInDatetime = clocking[0].startDateTime?.toISOString();
    clockOutDateTime = clocking[0].endDateTime?.toISOString();
  } else {
    return res.status(501).json({ error: "Ask Manager to clockIn first" });
  }

  const expense = new Expenses({
    title,
    amount,
    expenseClockIn: clockInDatetime,
    expenseClockOut: clockOutDateTime,
  });

  await expense.save();
  res.status(201).json({ message: "Expense added successfully" });
});
exports.getAllExpenses = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  let expense;
  let expenseCountTotal;
  let totalExpense = 0;

  if (id !== "all") {
    expense = await Expenses.find({
      expenseClockIn: id,
    });
  } else {
    expense = await Expenses.find();
  }

  expenseCountTotal = expense.length;

  expense.forEach((item) => {
    totalExpense += item.amount;
  });

  res.status(200).json({
    status: "success",
    data: expense,
    expenseCountTotal,
    totalExpense,
  });
});
