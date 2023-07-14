const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Product = require("./product");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { sequelize, modelName: "User", timestamps: false }
);
User.hasMany(Product, { foreignKey: "user_id", as: "product" });
Product.belongsTo(User, { foreignKey: "user_id", as: "user" });

module.exports = User;
