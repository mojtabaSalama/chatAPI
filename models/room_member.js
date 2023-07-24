module.exports = (sequelize, DataTypes) => {
  const room_member = sequelize.define(
    "room_member",
    {},
    {
      freezTableName: true,
    }
  );

  return room_member;
};
