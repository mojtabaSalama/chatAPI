module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define(
    "message",
    {
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      Image: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
    },
    {
      freezTableName: true,
    }
  );

  return message;
};
