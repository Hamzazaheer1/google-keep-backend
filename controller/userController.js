require("../db/conn");
const User = require("../model/userSchema");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getMe = (req, res, next) => {
  req.params.id = req.userID;
  next();
};
exports.getUser = factory.getOne(User);
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({
    role: { $in: ["ADMIN", "MANAGER", "WAITERS"] },
  })
    .select("-password -tokens")
    .lean();

  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.status(200).json({
    status: "success",
    result: users.length,
    data: users,
  });
});
exports.getAllBranches = catchAsync(async (req, res, next) => {
  const users = await User.find({
    role: { $in: ["MANAGER"] },
  })
    .select("-password -tokens")
    .lean();

  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.status(200).json({
    status: "success",
    result: users.length,
    data: users,
  });
});
exports.editBranchById = catchAsync(async (req, res, next) => {
  const { branchId } = req.params;
  const { name, email } = req.body;

  let branch = await User.findById(branchId);
  if (!branch) {
    return res.status(404).json({ message: "Branch not found" });
  }

  branch.branchName = name || branch.name;
  branch.email = email || branch.email;

  branch = await branch.save();

  res.status(200).json({
    status: "success",
    data: branch,
  });
});
exports.deleteBranchById = catchAsync(async (req, res, next) => {
  const { branchId } = req.params;

  const result = await User.deleteOne({ _id: branchId });

  if (result.deletedCount === 0) {
    return res.status(404).json({ message: "Branch not found" });
  }

  res.status(200).json({
    status: "success",
    message: "Branch deleted successfully",
  });
});
