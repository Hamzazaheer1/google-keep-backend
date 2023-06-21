require("../db/conn");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const Order = require("../model/orderSchema");
const Lobby = require("../model/LobbiesSchema");
const Clocking = require("../model/ClockingSchema");

exports.getAllOrders = factory.getAll(Order);
exports.getTakeAwayOrders = catchAsync(async (req, res, next) => {
  const order = await Order.find({ Type: "TAKEAWAY", Status: "Pending" });
  if (!order) {
    return res.status(404).json({ error: "No pending order found" });
  }

  res.status(200).json({ message: "success", data: order });
});
exports.addDineInOrderToPending = catchAsync(async (req, res) => {
  const { LobbyName, TableNo, items, slug } = req.body;
  const Status = "Pending";
  const Type = "DINEIN";
  const WaiterId = req.userID;

  let clockInDatetime;
  let clockOutDateTime;

  const clocking = await Clocking.find().sort({ startDateTime: -1 }).limit(1);
  if (clocking.length > 0 && clocking[0].status === true) {
    clockInDatetime = clocking[0].startDateTime?.toISOString();
    clockOutDateTime = clocking[0].endDateTime?.toISOString();
  } else {
    return res.status(501).json({ error: "Ask Manager to clockIn first" });
  }

  let totalPrice = 0;
  items.forEach((item) => {
    totalPrice += item.Qty * item.Price;
  });

  const lobby = await Lobby.findOne({ lobbyName: LobbyName });
  if (!lobby) {
    return res.status(404).json({ error: "Lobby not found" });
  }

  const tableIndex = lobby.Tables.findIndex(
    (table) => table.tableNumber === TableNo
  );
  if (tableIndex === -1) {
    return res.status(404).json({ error: "Table not found" });
  }

  const existingOrder = await Order.findOne({
    _id: slug,
  });

  if (
    existingOrder !== null &&
    existingOrder.TableNo === TableNo &&
    existingOrder.LobbyName === LobbyName
  ) {
    const orderItem = {
      items: items,
      createdAt: new Date(),
    };
    existingOrder.OrderItems.push(orderItem);
    existingOrder.TotalPrice += totalPrice;
    existingOrder.updatedAt = new Date(); // Update the updatedAt field
    const savedOrder = await existingOrder.save();
    return res.status(200).json(savedOrder);
  }

  lobby.Tables[tableIndex].isBooked = true;
  await lobby.save();

  const newOrder = new Order({
    LobbyName,
    TableNo,
    OrderItems: [{ items, createdAt: new Date() }],
    TotalPrice: totalPrice,
    Status,
    Type,
    WaiterId,
    OrderClockIn: clockInDatetime,
    OrderClockOut: clockOutDateTime,
  });

  const savedOrder = await newOrder.save();
  res.status(201).json(savedOrder);
});
exports.addDineInOrder = catchAsync(async (req, res, next) => {
  const { LobbyName, TableNo, orderId } = req.body;

  let clockInDatetime;
  let clockOutDateTime;

  const clocking = await Clocking.find().sort({ startDateTime: -1 }).limit(1);
  if (clocking.length > 0 && clocking[0].status === true) {
    clockInDatetime = clocking[0].startDateTime?.toISOString();
    clockOutDateTime = clocking[0].endDateTime?.toISOString();
  } else {
    return res.status(501).json({ error: "Ask Manager to clockIn first" });
  }

  const updateFields = {
    PaymentMethod: req.body.PaymentMethod,
    TotalPrice: req.body.TotalPrice,
    Status: "PaymentDone",
    Type: "DINEIN",
    WaiterId: req.userID,
    OrderClockIn: clockInDatetime,
    OrderClockOut: clockOutDateTime,
  };

  try {
    const lobby = await Lobby.findOne({ lobbyName: LobbyName });
    if (!lobby) {
      return res.status(404).json({ error: "Lobby not found" });
    }

    const tableIndex = lobby.Tables.findIndex(
      (table) => table.tableNumber === TableNo
    );
    if (tableIndex === -1) {
      return res.status(404).json({ error: "Table not found" });
    }

    lobby.Tables[tableIndex].isBooked = false;
    await lobby.save();

    const order = await Order.findOneAndUpdate(
      {
        LobbyName,
        TableNo,
        _id: orderId,
      },
      updateFields,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating dine-in order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
exports.cancelDineInOrder = catchAsync(async (req, res, next) => {
  const { LobbyName, TableNo } = req.body;

  const lobby = await Lobby.findOne({ lobbyName: LobbyName });
  if (!lobby) {
    return res.status(404).json({ error: "Lobby not found" });
  }

  const tableIndex = lobby.Tables.findIndex(
    (table) => table.tableNumber === TableNo
  );
  if (tableIndex === -1) {
    return res.status(404).json({ error: "Table not found" });
  }

  lobby.Tables[tableIndex].isBooked = false;

  await lobby.save();

  // for order
  const updatedItem = await Order.findByIdAndUpdate(
    req.params.id,
    { Status: "cancelled" },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(201).json(updatedItem);
});
exports.addTakeAwayOrder = catchAsync(async (req, res, next) => {
  const { CustomerName, PhoneNo, Address, Qty, PaymentMethod, Price, Title } =
    req.body;
  let TotalPrice = Qty * Price;
  let Status = "Pending";
  let Type = "TAKEAWAY";
  const WaiterId = req.userID;

  const newOrder = new Order({
    CustomerName,
    PhoneNo,
    Address,
    Qty,
    PaymentMethod,
    Price,
    Title,
    TotalPrice,
    Status,
    Type,
    WaiterId,
  });

  const savedOrder = await newOrder.save();
  res.status(201).json(savedOrder);
});
exports.updateOrderById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(422).json({ error: "Please provide the id" });
  }

  const order = await Order.findByIdAndUpdate(
    id,
    { Status: "Delivered" },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.status(200).json({ message: "success", data: order });
});
exports.getSingleOrder = catchAsync(async (req, res, next) => {
  const { lobbyName, tableNo, orderId } = req.params;

  if (!lobbyName || !tableNo || !orderId) {
    return res.status(422).json({ error: "Please fill the params properly" });
  }

  const orders = await Order.find({
    LobbyName: lobbyName,
    TableNo: tableNo,
    _id: orderId,
  });

  if (!orders || orders.length === 0) {
    return res.status(404).json({ error: "Order not found" });
  }

  const pendingOrders = orders.filter((order) => {
    return order.Status !== "PaymentDone" && order.Status !== "Cancelled";
  });

  if (pendingOrders.length === 0) {
    return res.status(404).json({ error: "No pending orders found" });
  }

  res.status(200).json({ message: "Success", data: pendingOrders });
});
exports.removeItemFromOrder = catchAsync(async (req, res, next) => {
  const { orderId, itemId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const orderItemIndex = order.OrderItems.findIndex((item) => {
      return item.items.some((subItem) => subItem._id.toString() === itemId);
    });

    if (orderItemIndex === -1) {
      return res.status(404).json({ error: "Order item not found" });
    }

    const orderItem = order.OrderItems[orderItemIndex];
    const updatedItems = orderItem.items.filter(
      (subItem) => subItem._id.toString() !== itemId
    );

    if (updatedItems.length === orderItem.items.length) {
      return res.status(404).json({ error: "Item not found in order" });
    }

    orderItem.items = updatedItems;

    // Delete the parent object if the items array is empty
    if (orderItem.items.length === 0) {
      order.OrderItems.splice(orderItemIndex, 1);
    }

    order.TotalPrice = order.OrderItems.reduce((total, item) => {
      return (
        total +
        item.items.reduce((subtotal, subItem) => {
          return subtotal + subItem.Qty * subItem.Price;
        }, 0)
      );
    }, 0);

    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.error("Error removing item from order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
