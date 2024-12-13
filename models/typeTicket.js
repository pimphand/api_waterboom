'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TicketType extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    TicketType.init({
        name: DataTypes.STRING,
        price: DataTypes.INTEGER,
        description: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'TicketType',
        tableName: 'ticket_types',
    });
    return TicketType;
};