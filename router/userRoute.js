const express = require("express");
const authController = require("../controller/authController");
const userController = require("../controller/userController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.get("/me", authenticate, userController.getMe, userController.getUser);
router.post("/register", authController.UserRegister);
router.post("/signin", authController.signin);
router.get("/signout", authController.signout);
router.get("/getAllUsers", userController.getAllUsers);

module.exports = router;
