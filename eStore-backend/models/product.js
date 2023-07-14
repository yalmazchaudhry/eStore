const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

// Models
// middleware (upload, auth)
// util/helper/functions
// controller (classes/functions - product, user ) add(){} update() getOne() getAll() delete(), register(), login()
// routes (product, user )

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    barcode: {
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
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Product",
    timestamps: false,
  }
);

module.exports = Product;
