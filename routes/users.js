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

router.post("/updateName", validUser, user.updateName);
router.post("/updatePassword", validUser, user.updatePassword);

router.post("/updateImage", validUser, upload.single("file"), user.updateImage);

router.post("/get", validUser, user.getbyid);
router.get("/getbyToken", validUser, user.getbyToken);
router.get("/remove", validUser, user.remove_user);
router.get("/all", validUser, user.allUsers);
router.get("/:image", user.getImage);

//---------------------------

module.exports = router;
