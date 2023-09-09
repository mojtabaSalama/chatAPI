const express = require("express");
const router = express.Router();
const message = require("../controllers/messages/messagesController");

const validUser = require("../middlewares/auth/userAuth");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

//routes -------------------
