const express = require("express");
const router = express.Router();
const user = require("../controllers/users/userController");

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
router.post("/register", user.register);

router.post("/login", user.login);

router.post("/update", validUser, user.update);

router.post(
  "/update-image",
  validUser,
  upload.single("file"),
  user.updateImage
);

router.post("/get-user", validUser, user.getbyid);
router.post("/remove_user", validUser, user.remove_user);

//---------------------------

module.exports = router;
