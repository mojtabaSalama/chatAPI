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
router.post(
  "/sendToUser",
  validUser,
  upload.single("file"),
  message.sendMessageUser
);
router.post(
  "/sendToRoom",
  validUser,
  upload.single("file"),
  message.sendMessageRoom
);
router.post("/AllMessagesUser", validUser, message.getAllMessagesUser);
router.post("/AllMessagesRoom", validUser, message.getAllMessagesRoom);

module.exports = router;
