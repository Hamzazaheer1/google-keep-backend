require("../db/conn");
const bcrypt = require("bcryptjs");
const catchAsync = require("../utils/catchAsync");
const User = require("../model/userSchema");

exports.UserRegister = catchAsync(async (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Plz fill the field properly" });
  }

  const userExist = await User.findOne({ email: email });

  if (userExist) {
    return res.status(422).json({ error: "Email already Exist" });
  } else {
    const user = new User({ email, password, name });
    await user.save();
    res.status(201).json({ message: "user registered successfully" });
  }
});
exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  let userLogin;

  if (email !== undefined) {
    userLogin = await User.findOne({ email });
  }

  if (userLogin) {
    const isMatch = await bcrypt.compare(password, userLogin.password);
    const token = await userLogin.generateAuthToken();

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    return res.status(201).json({
      success: "User signed in successfully",
      data: {
        user: userLogin._id,
      },
    });
  } else {
    return res.status(401).json({ error: "Invalid credentials" });
  }
});
exports.signout = (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).json({ status: "Cookie has been deleted!" });
};
exports.restrictTo = function (...roles) {
  return function (req, res, next) {
    if (!roles.includes(req.rootUser.role)) {
      return next(
        new Error("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
