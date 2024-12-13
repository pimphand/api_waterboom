"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ticket.belongsTo(models.TicketType, {
        foreignKey: "ticket_type_id",
        as: "DetailsTicket",
      });
    }
  }
  Ticket.init(
    {
      order_id: DataTypes.INTEGER,
      created_by: DataTypes.INTEGER,
      ticket_type_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      ticket_type_id: DataTypes.INTEGER,
      total_price: DataTypes.INTEGER,
      purchase_at: DataTypes.DATE,
      status: DataTypes.STRING,
      is_scan: DataTypes.BOOLEAN,
      scane_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Ticket",
    }
  );
  return Ticket;
};
