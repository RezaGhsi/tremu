const router = require("express").Router();
const controller = require("./../controllers/music");
const uploader = require("../middlewares/multer");
const authMiddleware = require("./../middlewares/auth");
const isAdminMiddleware = require("./../middlewares/isAdmin");

router.post(
  "/music",
  authMiddleware,
  isAdminMiddleware,
  uploader.single("music"),
  controller.uploadOne
);

module.exports = router;
