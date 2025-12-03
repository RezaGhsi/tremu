const router = require("express").Router();
const controller = require("./../controllers/music");
const authMiddleware = require("./../middlewares/auth");
const isAdminMiddleware = require("./../middlewares/isAdmin");

router.get("/", controller.getAllSongs);
router.get("/:id", controller.getMusicById);

module.exports = router;
