const bcrypt = require("bcrypt");
const userModel = require("./../models/user");
const { registerValidator } = require("./../validators/register");
const tokenGen = require("./../utils/tokenGenerator");

exports.register = async (req, res) => {
  const validationResult = registerValidator(req.body);
  if (validationResult !== true) {
    return res.status(400).json({ validationResult });
  }
  // try {
  const { name, username, email, age = 17 } = req.body;

  const isUserExists = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserExists) {
    return res.status(400).json({
      error: "User Already Registered With this Email or Username!",
    });
  }

  const hashedPass = bcrypt.hashSync(req.body.password, 10);

  const newUser = await userModel.create({
    name,
    username,
    email,
    password: hashedPass,
    age,
  });

  const tokens = tokenGen({ id: newUser._id }, "7d", "30d");

  res.status(201).json({ user: newUser, tokens });
  // } catch (err) {
  //   console.log("object");
  //   res.status(400).json({
  //     error: err.message,
  //   });
  // }
};

exports.logIn = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await userModel
      .findOne({ $or: [{ email: identifier }, { username: identifier }] })
      .lean()
      .select("-__v -createdAt -updatedAt");

    if (!user) {
      return res.status(404).json({ error: "Invalid Email or Password!" });
    }

    const isValidPass = await bcrypt.compare(password, user.password);

    if (!isValidPass) {
      return res.status(400).json({ message: "Invalid Email or Password!" });
    } else {
      const tokens = tokenGen({
        id: user._id,
      });

      delete user.password;
      res.json({ tokens });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
