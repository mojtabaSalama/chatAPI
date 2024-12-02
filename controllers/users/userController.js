const db = require("../../models/index");
const User = db.models.user;

const bcrypt = require("bcryptjs");
const xssFilter = require("xss-filters");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

require("dotenv").config();
const url = require("url");
const { response } = require("express");

const user = {
  // checkUser: async () => {
  // let userAuth = req.app.locals.user;
  // if (!userAuth ) {
  //   return res.status(400).json({ msg: " unautherized" });
  // }},

  register: async (req, res) => {
    try {
      let { name, password } = req.body;

      //check req.body
      if (!(name && password)) {
        return res.status(400).json({ msg: " please enter all fields" });
      }

      // check password
      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: " pssword must be at least 6 charachters" });

      //-------------------------------------

      //filter list
      let data = [name, password];
      //filtered data
      data.map((data) => {
        data = xssFilter.inHTMLData(data);
      });

      //make sure no admin is replicated
      let user = await User.findOne({ where: { name } });
      if (user) return res.status(400).json({ msg: "name is already exist" });

      //hash user password
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);

      //save to database
      const newUser = await User.create({
        name,

        password: hashedPassword,
      });

      //send to client
      res.json({
        user: {
          id: newUser.id,

          name: newUser.name,
        },
      });
    } catch (error) {
      console.log(error);
    }
  },
  login: async (req, res) => {
    try {
      let { name, password } = req.body;
      // check fields
      if (!name || !password) {
        return res.status(400).json({ msg: "please enter all feilds" });
      }

      //filter list
      let data = [name, password];
      //filtered data
      data.map((data) => {
        data = xssFilter.inHTMLData(data);
      });

      // be sure the user is exist
      User.findOne({ where: { name } }).then((user) => {
        if (!user) {
          return res.status(400).json({ msg: "user not found !" });
        }

        bcrypt.compare(password, user.password).then(async (isMatch) => {
          if (!isMatch) {
            return res.status(400).json({ msg: "password is incorrect" });
          } else {
            //sign user
            let token = jwt.sign({ id: user.id }, process.env.JWTSECRET);

            imageUrl = `public/images/${user.profilePic}`;
            let image = path.resolve(imageUrl);
            //send response
            res.status(200).json({
              token,
              user: {
                id: user.id,

                name: user.name,
                profilePicture: user.profilePic,
              },
            });
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  },
  getImage: async (req, res) => {
    const image = req.params.image;

    const imagePath = `public/images/${image}`;
    res.sendFile(path.resolve(imagePath));
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

      name: user.name,

      profilePic: user.profilePic,
    });
  },
  getbyToken: async (req, res) => {
    const userAuth = req.app.locals.user;

    if (!userAuth) {
      res.status(400).json({ msg: "unautherized , please login" });
    }

    let user = await User.findOne({ where: { id: userAuth.id } });
    if (!user) return res.status(400).json({ msg: "wrong id" });

    await res.json({
      user: {
        id: user.id,

        name: user.name,
        profilePicture: user.profilePic,
      },
    });
  },
  updatePassword: async (req, res) => {
    try {
      let userAuth = await req.app.locals.user;
      if (!userAuth) {
        res.status(400).json({ msg: "unautherized " });
      }

      const { newPassword, currentPassword } = req.body;
      // check
      if (!(newPassword && currentPassword))
        return res.status(400).json({ msg: "enter all feilds" });

      let user = await User.findOne({ where: { id: userAuth.id } });
      if (!user) return res.status(400).json({ msg: "wrong id" });

      //hash new user password
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(newPassword, salt);
      // compare curentPassword provided by user with password in database

      var compare = await bcrypt.compare(currentPassword, user.password);

      if (!compare)
        return res
          .status(400)
          .json({ msg: "Current password is not correct " });

      //update User
      let status = await User.update(
        { password: hashedPassword },
        { where: { id: userAuth.id } }
      );
      res.status(200).json({ msg: "password is updated succesfully! " });
    } catch (error) {
      if (error) throw error;
    }
  },
  updateImage: async (req, res) => {
    try {
      let userAuth = req.app.locals.user;
      if (!userAuth) {
        return res.status(400).json({ msg: " unautherized" });
      }

      const user = await User.findOne({ where: { id: userAuth.id } });
      let { filename } = req.file;

      // check if file is an image
      const allowedTypes = [
        "image/jpg",
        "image/png",
        "image/gif",
        "image/jpeg",
      ];

      if (!allowedTypes.includes(req.file.mimetype)) {
        fs.unlink(
          path.join(__dirname, `../../public/images/${filename}`),
          (err) => {
            if (err) throw err;
            console.log("deleted type is not image");
          }
        );
        return res.status(400).json({ msg: "File is not an image" });
      }

      //check if user already has an image
      let filePath = path.join(
        __dirname,
        `../../public/images/${user.profilePic}`
      );

      if (fs.existsSync(filePath)) {
        //delete from fs system
        fs.unlink(filePath, (err) => {
          console.log("the existed file deleted");
        });
        //save the new link
        user.profilePic = filename;
        await user.save();
        return res.status(200).json({ msg: "Profile picture is updated" });
      } else {
        user.profilePic = filename;
        return res.status(200).json({ msg: "Profile picture is updated" });
      }
    } catch (error) {
      if (error) throw error;
    }
  },

  updateName: async (req, res) => {
    try {
      let userAuth = req.app.locals.user;
      if (!userAuth) {
        return res.status(400).json({ msg: " unautherized" });
      }

      const user = await User.findOne({ where: { id: userAuth.id } });
      let { name } = req.body;

      //check user

      const checkUser = await User.findOne({ where: { name } });
      if (checkUser) {
        return res
          .status(400)
          .json({ msg: "name is already existed, try different one " });
      } else {
        //save the new link
        user.name = name;
        await user.save();
        res.status(200).json({ msg: "name is updated successfully ! " });
      }
    } catch (error) {
      if (error) throw error;
    }
  },

  allUsers: async (req, res) => {
    try {
      let userAuth = req.app.locals.user;
      if (!userAuth) {
        return res.status(400).json({ msg: " unautherized" });
      }

      const users = await User.findAll();
      res.status(200).json({
        users: users,
      });
    } catch (error) {
      if (error) throw error;
    }
  },

  remove_user: async (req, res) => {
    let userAuth = req.app.locals.user;
    if (!userAuth) {
      return res.status(400).json({ msg: " unautherized" });
    }

    User.destroy({ where: { id: userAuth.id } })
      .then((num) => {
        if (num == 1) {
          res.send({ msg: "deleted successfully" });
        } else {
          res.send("can't delete");
        }
      })
      .catch((err) => {
        res.status(400).send({ msg: err });
      });
  },
};

module.exports = user;
