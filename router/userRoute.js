const express = require("express");
const authController = require("../controller/authController");
const userController = require("../controller/userController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

//Auth
router.get("/me", authenticate, userController.getMe, userController.getUser);
router.post("/register", authController.UserRegister);
router.post("/signin", authController.signin);
router.get("/signout", authController.signout);
router.get("/getAllUsers", userController.getAllUsers);
//Notes
router.post("/addNote", authenticate, userController.addNote);
router.get("/getMyNotes", authenticate, userController.getMyNotes);
router.patch("/updatedNote/:id", userController.updateNote);
router.delete("/deleteNote/:id", userController.deleteNote);

module.exports = router;
