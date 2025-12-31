const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Order = sequelize.define("Order", {
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Order;
