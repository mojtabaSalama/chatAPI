const db = require("../../models/index");

const User = db.models.user;
const Room = db.models.room;
const Room_member = db.models.room_member;

const room = {
  createRoom: async (req, res) => {
    try {
      let { room_name } = req.body;

      //check user is existed
      if (!room_name)
        res.status(400).json({ msg: "enter the room name please  " });

      //check the if the user is autherized
      let user = await req.app.locals.user;
      if (!user) {
        res.status(400).json({ msg: "unautherized " });
      }

      const room = await Room.create({
        name: room_name,
      });

      const room_member = await Room_member.create({
        roomId: room.id,
        userId: user.id,
      });
      res.status(200).json({ msg: "you can send messages to room " });
    } catch (error) {}
  },
  joinRoom: async (req, res) => {
    try {
      let { room_id } = req.body;

      //check user is existed
      if (!room_id) res.status(400).json({ msg: "enter room id please  " });

      //check the if the user is autherized
      let user = await req.app.locals.user;
      if (!user) {
        res.status(400).json({ msg: "unautherized " });
      }

      //check if room is existed
      let room = await Room.findOne({ where: { id: room_id } });
      if (!room) return res.status(400).json("wrong room id");

      let room_member = await Room_member.findOne({
        where: { roomId: room_id },
      });
      if (room_member) {
        res.status(400).json({ msg: "you are alreadey room member !  " });
      }

      if (!room_member) {
        const new_member = await Room_member.create({
          roomId: room.id,
          userId: user.id,
        });
        res
          .status(200)
          .json({ msg: "you joined room!  you can send messages to room " });
      }
    } catch (error) {}
  },
  roomInfo: async (req, res) => {
    try {
      let { room_id } = req.body;

      //check user is existed
      if (!room_id) res.status(400).json({ msg: "enter the room id please  " });

      //check the if the user is autherized
      let user = await req.app.locals.user;
      if (!user) {
        res.status(400).json({ msg: "unautherized " });
      }

      //check if room is existed
      let room = await Room.findOne({ where: { id: room_id } });
      if (!room) return res.status(400).json("wrong room id");

      let room_members = await Room_member.findAll({
        where: { roomId: room_id },
      });

      await res.json({
        room_name: room.name,
        room_members: room_members,
      });
    } catch (error) {}
  },

  leaveRoom: async (req, res) => {
    try {
      let { room_id } = req.body;

      if (!room_id) return res.status(400).json("enter room id");

      //check if room is existed
      let room = await Room.findOne({ where: { id: room_id } });
      if (!room) return res.status(400).json("wrong room id");

      //check the if the user is autherized
      let user = await req.app.locals.user;
      if (!user) res.status(400).json({ msg: "unautherized " });
      //user is no longer room memeber
      Room_member.destroy({ where: { userId: user.id } });

      //delete empty room
      const check_room_member = room_member.findAll({
        where: { userId: user.id },
      });
      if (!check_room_member) Room.destroy({ where: { id: room_id } });

      res.status(200).json("you leaved room");
    } catch (error) {}
  },
};
module.exports = room;
