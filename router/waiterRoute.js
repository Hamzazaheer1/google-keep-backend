const express = require("express");
const authController = require("../controller/authController");
const userController = require("../controller/userController");
const orderController = require("../controller/orderController");
const waiterController = require("../controller/waiterController");
const cartController = require("../controller/cartController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.get(
  "/getAllOrders",
  // authenticate,
  // authController.restrictTo("WAITER"),
  orderController.getAllOrders
);
router.get(
  "/getTakeawayPendingOrders",
  authenticate,
  authController.restrictTo("WAITER"),
  orderController.getTakeAwayOrders
);
router.get(
  "/getItemsById/:id",
  // authenticate,
  // authController.restrictTo("WAITER"),
  waiterController.getItemByCategory
);
router.patch(
  "/makeDineInOrder",
  // authenticate,
  // authController.restrictTo("WAITER"),
  orderController.addDineInOrder
);
router.post(
  "/makeDineInOrderPending",
  // authenticate,
  // authController.restrictTo("WAITER"),
  orderController.addDineInOrderToPending
);
router.post(
  "/makeTakeAwayOrder",
  authenticate,
  authController.restrictTo("WAITER"),
  orderController.addTakeAwayOrder
);
router.patch("/updateOrderById/:id", orderController.updateOrderById);
router.get(
  "/getSingleOrder/:lobbyName/:tableNo/:orderId",
  orderController.getSingleOrder
);
router.patch("/cancelOrder/:id", orderController.cancelDineInOrder);
// Add Cart Items to DB
router.get("/getAllCartItems", cartController.getAllCartItems);
router.get("/getCartItemBy/:ln/:tn", cartController.getAllCartItems);
router.post("/addcartItemToDB", cartController.addCartItemToDb);
router.patch(
  "/deleteItemBy/:orderId/:itemId",
  orderController.removeItemFromOrder
);
module.exports = router;
