const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./User");

const RefreshToken = sequelize.define("RefreshToken", {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  revokedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  replacedByToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

User.hasMany(RefreshToken, { onDelete: "CASCADE" });
RefreshToken.belongsTo(User);

module.exports = RefreshToken;
