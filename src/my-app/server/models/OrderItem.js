const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const OrderItem = sequelize.define("OrderItem", {
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING,
  },
});

module.exports = OrderItem;
