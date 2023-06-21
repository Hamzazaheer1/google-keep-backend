require("../db/conn");
const User = require("../model/userSchema");
const Note = require("../model/noteSchema");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getMe = (req, res, next) => {
  req.params.id = req.userID;
  next();
};
exports.getUser = factory.getOne(User);
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select("-password -tokens").lean();

  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.status(200).json({
    status: "success",
    result: users.length,
    data: users,
  });
});
exports.addNote = catchAsync(async (req, res, next) => {
  const { title, note } = req.body;

  const data = new Note({ title, note });
  await data.save();
  res.status(201).json({ message: "note added successfully" });
});
exports.getMyNotes = catchAsync((req, res, next) => {
  const id = req.userID;
});
