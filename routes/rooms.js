const express = require("express");
const router = express.Router();
const room = require("../controllers/room/roomController");

const validUser = require("../middlewares/auth/userAuth");

//routes -------------------
router.post("/create", validUser, room.createRoom);
router.post("/join", validUser, room.joinRoom);
router.post("/info", validUser, room.roomInfo);
router.post("/leave", validUser, room.leaveRoom);
