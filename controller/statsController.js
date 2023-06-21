require("../db/conn");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const Order = require("../model/orderSchema");
const Lobby = require("../model/LobbiesSchema");
const Clocking = require("../model/ClockingSchema");

exports.getItemSoldQTY = catchAsync(async (req, res, next) => {
  const check = req.params.id;
  const matchCriteria = {
    Status: "PaymentDone",
  };

  if (check !== "all") {
    matchCriteria.OrderClockIn = check;
  }

  const quantities = await Order.aggregate([
    { $match: matchCriteria },
    { $unwind: "$OrderItems" },
    { $unwind: "$OrderItems.items" },
    {
      $group: {
        _id: "$OrderItems.items.Title",
        quantity: { $sum: "$OrderItems.items.Qty" },
      },
    },
    {
      $sort: {
        price: 1,
      },
    },
  ]);

  res.status(200).json({ message: "success", quantities });
});
exports.getSoldItemPrices = catchAsync(async (req, res, next) => {
  const check = req.params.id;
  const matchCriteria = {
    Status: "PaymentDone",
  };

  if (check !== "all") {
    matchCriteria.OrderClockIn = check;
  }

  const quantities = await Order.aggregate([
    { $match: matchCriteria },
    { $unwind: "$OrderItems" },
    { $unwind: "$OrderItems.items" },
    {
      $group: {
        _id: "$OrderItems.items.Title",
        price: { $sum: "$OrderItems.items.Price" },
      },
    },
    {
      $sort: {
        price: 1,
      },
    },
  ]);

  res.status(200).json({ message: "success", quantities });
});
exports.getItemSoldSales = catchAsync(async (req, res, next) => {
  const check = req.params.id;
  const matchCriteria = {
    Status: "PaymentDone",
  };
  const matchCriteria2 = {
    Status: "cancelled",
  };

  if (check !== "all") {
    matchCriteria.OrderClockIn = check;
    matchCriteria2.OrderClockIn = check;
  }

  const paymentDone = await Order.aggregate([
    { $match: matchCriteria },
    { $group: { _id: null, total: { $sum: "$TotalPrice" } } },
  ]);

  const cancelled = await Order.aggregate([
    { $match: matchCriteria2 },
    { $group: { _id: null, total: { $sum: "$TotalPrice" } } },
  ]);

  res.status(200).json({
    message: "success",
    paymentDone: paymentDone[0]?.total || 0,
    cancelled: cancelled[0]?.total || 0,
  });
});
exports.getOrderTotals = catchAsync(async (req, res, next) => {
  const check = req.params.id;
  const matchCriteria = {
    Status: "PaymentDone",
  };

  if (check !== "all") {
    matchCriteria.OrderClockIn = check;
  }

  const completedCountResult = await Order.aggregate([
    {
      $match: { matchCriteria },
    },
    {
      $group: {
        _id: null,
        completedCount: { $sum: 1 },
      },
    },
  ]);

  const canceledCountResult = await Order.aggregate([
    {
      $match: { matchCriteria },
    },
    {
      $group: {
        _id: null,
        canceledCount: { $sum: 1 },
      },
    },
  ]);

  const numberOfCompletedOrders =
    completedCountResult.length > 0
      ? completedCountResult[0].completedCount
      : 0;
  const numberOfCanceledOrders =
    canceledCountResult.length > 0 ? canceledCountResult[0].canceledCount : 0;

  res.status(200).json({ numberOfCompletedOrders, numberOfCanceledOrders });
});
