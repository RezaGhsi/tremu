const bcrypt = require("bcrypt");
const User = require("../models/user");
const middleware = require("../middlewares/user");
const validator = require("../validators/register");
const tokenGen = require("../utils/tokenGenerator");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().lean().select("-password");
    res.json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.json(req.user);
};
