module.exports = (sequelize, DataTypes) => {
  const room = sequelize.define(
    "room",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV1,
      },
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
