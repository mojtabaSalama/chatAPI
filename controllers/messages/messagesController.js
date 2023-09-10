const db = require("../../models/index");

const User = db.models.user;
const Room = db.models.room;
const Room_member = db.models.room_member;
const Message = db.models.message;

const message = {
  sendMessageUser: async (req, res) => {
    try {
      let { filename } = req.file;

      let { text, user_id } = req.body;

      //check req.body
      if (!(text || user_id || filename)) {
        return res.status(400).json({ msg: " please enter all fields" });
      }

      //check if user is existed
      let user = await User.findOne({ where: { id: user_id } });
      if (!user) return res.status(400).json("wrong user id");

      //filter list
      let data = [text, user_id, filename];
      //filtered data
      data.map((data) => {
        data = xssFilter.inHTMLData(data);
      });
      let userAuth = req.app.locals.user;

      //save to database
      let message = await Message.create({
        text,

        sender: userAuth.id,
        receiver: user.id,
      });
      if (!filename) {
        filename = null;
      }

      if (filename) {
        filename = req.file;
        // check if file is an image]
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

        if (!allowedTypes.includes(req.file.mimetype)) {
          fs.unlink(
            path.join(__dirname, `../../public/images/${filename}`),
            (err) => {
              if (err) throw err;
              console.log("deleted type is not image");
            }
          );
          return res.status(400).json("File is not an image");
        }
        Message.image = filename.filename;
        await message.save();
      }

      res.status(200).json("message is sent");
    } catch (error) {
      console.log(error);
      return res.status(400).json("something happened");
    }
  },

  sendMessageRoom: async (req, res) => {
    try {
      let { filename } = req.file;

      let { text, room_id } = req.body;

      //check req.body
      if (!(text || room_id || filename)) {
        return res.status(400).json({ msg: " please enter all fields" });
      }

      //check if room is existed
      let room = await Room.findOne({ where: { id: room_id } });
      if (!room) return res.status(400).json("wrong room id");

      let is_room_member = await Room_member.findOne({
        where: { userId: userAuth.id, roomId: room.id },
      });
      if (!is_room_member)
        return res.status(400).json("unautherized , you are not a room member");

      //filter list
      let data = [text, room_id, filename];
      //filtered data
      data.map((data) => {
        data = xssFilter.inHTMLData(data);
      });
      let userAuth = req.app.locals.user;

      //save to database
      let message = await Message.create({
        text,

        sender: userAuth.id,
        roomId: room.id,
      });
      if (!filename) {
        filename = null;
      }

      if (filename) {
        filename = req.file;
        // check if file is an image]
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

        if (!allowedTypes.includes(req.file.mimetype)) {
          fs.unlink(
            path.join(__dirname, `../../public/images/${filename}`),
            (err) => {
              if (err) throw err;
              console.log("deleted type is not image");
            }
          );
          return res.status(400).json("File is not an image");
        }
        Message.image = filename.filename;
        await message.save();
      }

      res.status(200).json("message is sent");
    } catch (error) {
      console.log(error);
      return res.status(400).json("something happened");
    }
  },
  getAllMessagesUser: async (req, res) => {
    try {
      let { user_id } = req.body;
      if (!user_id) {
        res.status(400).json({ msg: "enter user id please ! " });
      }

      let userAuth = await req.app.locals.user;
      if (!userAuth) {
        res.status(400).json({ msg: "unautherized " });
      }

      //check if user is existed
      let user = await User.findOne({ where: { id: user_id } });
      if (!user) return res.status(400).json("wrong user id");

      let messages = await Message.findAll({
        where: {
          [Op.or]: [{ sender: userAuth.id }, { sender: user.id }],
          [Op.or]: [{ receiver: userAuth.id }, { receiver: user.id }],
        },
      });

      res.json({
        messages: messages,
      });
    } catch (error) {}
  },
  getAllMessagesRoom: async (req, res) => {
    try {
      let { room_id } = req.body;
      if (!room_id) {
        res.status(400).json({ msg: "enter user id please ! " });
      }

      let userAuth = await req.app.locals.user;
      if (!userAuth) {
        res.status(400).json({ msg: "unautherized " });
      }

      //check if user is existed
      let room = await Room.findOne({ where: { id: room_id } });
      if (!room) return res.status(400).json("wrong user id");

      let is_room_member = await Room_member.findOne({
        where: { userId: userAuth.id, roomId: room.id },
      });
      if (!is_room_member)
        return res.status(400).json("unautherized , you are not a room member");

      let messages = await Message.findAll({
        where: {
          roomId: room.id,
        },
      });
      res.json({
        messages: messages,
      });
    } catch (error) {}
  },
};
module.exports = message;
