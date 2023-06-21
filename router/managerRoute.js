const express = require("express");
const authController = require("../controller/authController");
const managerController = require("../controller/managerController");
const statsController = require("../controller/statsController");
const authenticate = require("../middleware/authenticate");
const multer = require("../middleware/multer");

const router = express.Router();

// Lobby
router.post(
  "/addLobby",
  authenticate,
  authController.restrictTo("MANAGER"),
  managerController.addLobby
);
router.get("/getLobbies", authenticate, managerController.getAllLobbies);
router.patch(
  "/editLobby/:lobbyId",
  authenticate,
  authController.restrictTo("MANAGER"),
  managerController.updateLobby
);
router.delete(
  "/deleteLobbies/:id",
  authenticate,
  authController.restrictTo("MANAGER"),
  managerController.removeLobby
);
// category
router.post(
  "/addCategory",
  authenticate,
  authController.restrictTo("MANAGER"),
  managerController.addCategory
);
router.get(
  "/getAllCategories",
  // authenticate,
  // authController.restrictTo("MANAGER"),
  managerController.getAllCategories
);
router.patch(
  "/editCategory/:id",
  authenticate,
  authController.restrictTo("MANAGER"),
  managerController.updateCategory
);
router.delete(
  "/deleteCategory/:id",
  authenticate,
  authController.restrictTo("MANAGER"),
  managerController.removeCategory
);
// Items
router.get(
  "/getItems",
  authenticate,
  authController.restrictTo("MANAGER"),
  managerController.getAllItems
);
router.patch(
  "/editItem/:id",
  authenticate,
  multer.uploadUserImg,
  multer.UserImgResize,
  authController.restrictTo("MANAGER"),
  managerController.updateItem
);
router.delete(
  "/deleteItems/:id",
  authenticate,
  authController.restrictTo("MANAGER"),
  managerController.removeItem
);
router.post(
  "/addItems",
  authenticate,
  authController.restrictTo("MANAGER"),
  multer.uploadUserImg,
  multer.UserImgResize,
  managerController.addItem
);

// Waiters
router.get(
  "/getAllWaiters",
  authenticate,
  authController.restrictTo("MANAGER"),
  managerController.getAllWaiters
);
router.patch(
  "/editWaiters/:id",
  authenticate,
  authController.restrictTo("MANAGER"),
  managerController.updateWaiter
);
router.delete(
  "/deleteWaiters/:id",
  authenticate,
  authController.restrictTo("MANAGER"),
  managerController.removeWaiter
);

// Payment Method
router.get(
  "/getPaymentMethods",
  // authenticate,
  // authController.restrictTo("MANAGER"),
  managerController.getAllPaymentMethod
);
router.patch(
  "/editPaymentMethods/:id",
  authenticate,
  authController.restrictTo("MANAGER"),
  managerController.updatePaymentMethod
);
router.delete(
  "/deletePaymentMethods/:id",
  authenticate,
  authController.restrictTo("MANAGER"),
  managerController.removePaymentMethod
);
router.post(
  "/addPaymentMethods",
  authenticate,
  authController.restrictTo("MANAGER"),
  managerController.addPaymentMethod
);

// Clocking
router.get("/getAllClockings", managerController.getAllClockings);
router.post(
  "/checkIn",
  authenticate,
  authController.restrictTo("MANAGER"),
  managerController.checkIn
);
router.patch(
  "/checkOut/:id",
  authenticate,
  authController.restrictTo("MANAGER"),
  managerController.checkOut
);

// Completed Orders
router.get(
  "/getOrderByClocking/:id",
  // authenticate,
  // authController.restrictTo("MANAGER"),
  managerController.getOrderByClockingId
);

// Stats
router.get("/getSoldItemsQTY/:id", statsController.getItemSoldQTY);
router.get("/getSoldItemsPrice/:id", statsController.getSoldItemPrices);
router.get("/getSoldItemsSales/:id", statsController.getItemSoldSales);
router.get("/getOrderTotals/:id", statsController.getOrderTotals);

// Expenses
router.get(
  "/getAllExpenses/:id",
  // authenticate,
  // authController.restrictTo("MANAGER"),
  managerController.getAllExpenses
);
router.post(
  "/addExpense",
  // authenticate,
  // authController.restrictTo("MANAGER"),
  managerController.addExpense
);
router.patch(
  "/updateExpense/:id",
  authenticate,
  authController.restrictTo("MANAGER"),
  managerController.updateExpense
);
router.delete(
  "/removeExpense/:id",
  authenticate,
  authController.restrictTo("MANAGER"),
  managerController.removeExpense
);

module.exports = router;
