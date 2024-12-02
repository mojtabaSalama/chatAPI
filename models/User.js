module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      profilePic: {
        type: DataTypes.STRING,
        defaultValue: null,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezTableName: true,
    }
  );

  return user;
};
