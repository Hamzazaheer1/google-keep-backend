const express = require("express");
const authController = require("../controller/authController");
const userController = require("../controller/userController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.get("/me", authenticate, userController.getMe, userController.getUser);
router.post("/admin-register", authController.AdminRegister);
router.post(
  "/branch-register",
  authenticate,
  authController.restrictTo("ADMIN"),
  authController.BranchRegister
);
router.post(
  "/waiter-register",
  authenticate,
  authController.restrictTo("MANAGER"),
  authController.WaiterRegister
);
router.post("/signin", authController.signin);
router.get("/signout", authController.signout);

// Admin
router.get(
  "/getAllBranches",
  authenticate,
  authController.restrictTo("ADMIN"),
  userController.getAllBranches
);
router.patch(
  "/editBranch/:branchId",
  authenticate,
  authController.restrictTo("ADMIN"),
  userController.editBranchById
);
router.delete(
  "/deleteBranch/:branchId",
  authenticate,
  authController.restrictTo("ADMIN"),
  userController.deleteBranchById
);

module.exports = router;
