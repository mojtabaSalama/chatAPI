module.exports = (sequelize, DataTypes) => {
  const room = sequelize.define(
    "room",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezTableName: true,
    }
  );

  return room;
};
