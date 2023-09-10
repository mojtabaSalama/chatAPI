require("dotenv").config();
const Sequelize = require("sequelize");

//connecting to mysql
const sequelize = new Sequelize(
  process.env.DBNAME,
  process.env.DBUSER,
  process.env.DBPASSWORD,
  {
    host: process.env.DBHOST,
    dialect: process.env.DIALECT,
  }
);

//initializing db object holding db_connection && db_models
let db = {};
db.sequelize = sequelize;
db.models = {};

//require the objects
let user = require("./User")(sequelize, Sequelize.DataTypes);
let message = require("./message")(sequelize, Sequelize.DataTypes);
let room = require("./room")(sequelize, Sequelize.DataTypes);
let room_member = require("./room_member")(sequelize, Sequelize.DataTypes);

// //sql relationship here -------------------------------
user.hasMany(message, {
  foreignKey: "sender",
});
user.hasMany(message, { foreignKey: "receiver" });
room_member.belongsTo(user);

room_member.belongsTo(room);
room.hasMany(message);

// //-----------------------------------------------------

// //add to db models
db.models.user = user;
db.models.room = room;
db.models.message = message;
db.models.room_member = room_member;

module.exports = db;
