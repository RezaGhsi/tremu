const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const musicRoutes = require("./routes/music");
const userRoutes = require("./routes/user");
const uploadRoutes = require("./routes/upload");
const downloadRoutes = require("./routes/download");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use(
  "/uploads/musics",
  express.static(path.join(__dirname, "uploads", "musics"))
);

app.use("/api/auth", authRoutes);
app.use("/download/music/", downloadRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/user", userRoutes);
app.use("/api/upload", uploadRoutes);

app.use((err, req, res, next) => {
  if (!err) return next();

  if (err instanceof multer.MulterError) {
    return res.status(err.status || 400).json({ error: err.message });
  }
  console.error(err);
  return res
    .status(err.status || 500)
    .json({ error: err.message || "server error!" });
});

module.exports = app;
