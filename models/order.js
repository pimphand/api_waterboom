"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.hasMany(models.Ticket, {
        foreignKey: "order_id",
        as: "Tickets",
      });
    }
  }
  Order.init(
    {
      quantity: DataTypes.INTEGER,
      totalPrice: DataTypes.INTEGER,
      totalPayment: DataTypes.INTEGER,
      moneyChange: DataTypes.INTEGER,
      transactionAt: DataTypes.DATE,
      arrivalDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
