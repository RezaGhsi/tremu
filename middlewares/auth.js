const jwt = require("jsonwebtoken");
const userModel = require("./../models/user");

module.exports = async (req, res, next) => {
  const authHeader = req.header("authorization")?.split(" ");
  if (!authHeader) {
    return res.status(403).json({
      error: "This route is Protected and You dont Have Access to it!!",
    });
  }

  if (authHeader[0] !== "Bearer") {
    return res.status(403).json({
      error: "This route is Protected and You dont Have Access to it!!",
    });
  }

  const token = authHeader[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if (!payload) {
      return res.status(403).json({
        error: "This route is Protected and You dont Have Access to it!!",
      });
    }

    const user = await userModel.findById(payload.id).lean();
    if (!user) {
      return res.status(403).json({
        error: "This route is Protected and You dont Have Access to it!!",
      });
    }
    Reflect.deleteProperty(user, "password");

    req.user = user;

    next();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
