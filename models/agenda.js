"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Agenda extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Agenda.init(
    {
      title: DataTypes.STRING,
      className: DataTypes.STRING,
      start: DataTypes.STRING,
      end: DataTypes.DATEONLY,
      description: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      updatedBy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Agenda",
    }
  );
  return Agenda;
};
