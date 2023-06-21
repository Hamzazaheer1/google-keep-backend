require("../db/conn");
const Cart = require("../model/cartSchema");
const Order = require("../model/orderSchema");
const Lobby = require("../model/LobbiesSchema");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");

exports.getAllCartItems = factory.getAll(Cart);
exports.addCartItemToDb = catchAsync(async (req, res, next) => {
  const { LobbyName, TableNo, items } = req.body;
  const Status = "DINEIN";

  let existingCart = await Cart.findOne({ LobbyName, TableNo });

  if (existingCart) {
    existingCart.items = [...existingCart.items, ...items];
    existingCart.Status = Status;
    const savedCart = await existingCart.save();
    res.status(200).json({ message: "success", data: savedCart });
  } else {
    const newCart = new Cart({
      LobbyName,
      TableNo,
      items,
      Status,
    });

    const savedCart = await newCart.save();
    res.status(200).json({ message: "success", data: savedCart });
  }
});
exports.getCartItemById = catchAsync(async (req, res, next) => {
  const { LobbyName, TableNo, items } = req.body;
  const Status = "DINEIN";

  const item = new Cart({
    LobbyName,
    TableNo,
    items,
    Status,
  });

  const saveItem = await item.save();
  res.status(200).json({ message: "success", data: saveItem });
});
