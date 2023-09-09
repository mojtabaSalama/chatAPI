const db = require("../../models/index");
const User = db.models.user;

const bcrypt = require("bcryptjs");
const xssFilter = require("xss-filters");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { checkPrimeSync } = require("crypto");
require("dotenv").config();

const user = {
  register: async (req, res) => {
    try {
      let { name, email, password } = req.body;

      //check req.body
      if (!(name && password && email)) {
        return res.status(400).json({ msg: " please enter all fields" });
      }

      // check password
      if (password.length < 6)
        return res.status(400).json(" pssword must be at least 6 charachters");

      //-------------------------------------

      //filter list
      let data = [name, email, password];
      //filtered data
      data.map((data) => {
        data = xssFilter.inHTMLData(data);
      });

      //make sure no admin is replicated
      let user = await User.findOne({ where: { email } });
      if (user) return res.status(403).json("email already exist");

      //make sure no userName is replicated
      let checkUser = await User.findOne({ where: { email } });
      if (checkUser)
        return res.status(403).json("user name is used try different one ");

      //hash user password
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);

      //save to database
      const newUser = await User.create({
        name,

        email,

        password: hashedPassword,
      });

      //send to client
      res.json({
        user: {
          id: newUser.id,

          email: newUser.email,
          name: newUser.name,
        },
      });
    } catch (error) {
      console.log(error);
    }
  },
  login: async (req, res) => {
    try {
      let { email, password } = req.body;
      // check fields
      if (!email || !password) {
        return res.status(400).json({ msg: "please enter all feilds" });
      }

      //filter list
      let data = [email, password];
      //filtered data
      data.map((data) => {
        data = xssFilter.inHTMLData(data);
      });

      // be sure the user is exist
      User.findOne({ where: { email } }).then((user) => {
        if (!user) {
          return res.status(400).json({ msg: "user not found !" });
        }

        bcrypt.compare(password, user.password).then(async (isMatch) => {
          if (!isMatch) {
            return res.status(400).json({ msg: "password is incorrect" });
          } else {
            //sign user
            let token = jwt.sign({ id: user.id }, process.env.JWTSECRET);

            //send response
            res.json({
              token,
              user: {
                id: user.id,

                email: user.email,
                name: user.name,
              },
            });
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  },
  getbyid: async (req, res) => {
    let { id } = req.body;

    let userAuth = req.app.locals.user;
    if (!userAuth) {
      res.status(400).json({ msg: "unautherized , please login" });
    }

    if (!id) {
      return res.status(400).json({ msg: "please inter user's id" });
    }
    let user = await User.findOne({ where: { id } });
    if (!user) return res.status(400).json({ msg: "wrong id" });

    await res.json({
      id: user.id,

      email: user.email,
      name: user.name,
      profilePicture: user.profilePic,
    });
  },
  update: async (req, res) => {
    try {
      const { name, password, email, id } = req.body;
      // check
      if (!(name && password && email && id))
        return res.status(400).json("enter all feilds");

      let user = await User.findOne({ where: { id } });
      if (!user) return res.status(400).json({ msg: "wrong id" });

      let userAuth = await req.app.locals.user;
      if (userAuth.id != user.id) {
        res.status(400).json({ msg: "unautherized " });
      }
      //hash user password
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);

      //update User
      let status = await User.update(
        { name, password: hashedPassword, email },
        { where: { id } }
      );
      res.send(`updated user successfully ${status}`);
    } catch (error) {
      if (error) throw error;
    }
  },
  updateImage: async (req, res) => {
    try {
      let { filename } = req.file;
      let { id } = req.body;

      // check if file is an image
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

      //check request
      if (!id) return res.status(400).json("add your id");

      //check user
      const user = await User.findOne({ where: { id } });
      let newUser = req.app.locals.user;

      if (newUser.id != user.id) {
        return res.status(400).json("unautherized");
      } else {
        //check if user already has an image
        let filePath = path.join(
          __dirname,
          `../../public/images/${user.profilePic}`
        );

        if (fs.existsSync(filePath)) {
          //delete from fs system
          fs.unlink(filePath, (err) => {
            return res.status(400).json("File is not saved");
          });
          //save the new link
          user.profilePic = filename;
          await user.save();
          res.json({ user });
        } else {
          user.profilePic = filename;
          await user.save();
          res.json({ user });
        }
      }
    } catch (error) {
      if (error) throw error;
    }
  },
  remove_user: async (req, res) => {
    let { id } = req.body;
    if (!id) {
      return res.status(400).json({ msg: "please enter user id" });
    }
    let user = await User.findOne({ where: { id } });
    if (!user) return res.status(400).json({ msg: "wrong id" });

    let userAuth = await req.app.locals.user;
    if (userAuth.id != user.id) {
      res.status(400).json({ msg: "unautherized " });
    }
    data = xssFilter.inHTMLData(id);

    User.destroy({ where: { id } })
      .then((num) => {
        if (num == 1) {
          res.send({ message: "deleted successfully" });
        } else {
          res.send("can't delete");
        }
      })
      .catch((err) => {
        res.status(404).send({ message: err });
      });
  },
};

module.exports = user;
