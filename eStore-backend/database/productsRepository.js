const Product = require("../models/product");
const { Op } = require("sequelize");
const query = require("../config/dbConfigSimple");
class ProductsRepository {
  //Queries using ORM (Sequelize)

  // static async getProducts(
  //   userId,
  //   offset,
  //   limit,
  //   search,
  //   sortDirection,
  //   sortColumn
  // ) {
  //   let whereClause = {
  //     user_id: userId,
  //   };

  //   if (search) {
  //     whereClause[Op.or] = [
  //       { name: { [Op.like]: `%${search}%` } },
  //       { barcode: { [Op.like]: `%${search}%` } },
  //       { price: { [Op.eq]: search } },
  //       { quantity: { [Op.eq]: search } },
  //     ];
  //   }
  //   let column;
  //   switch (parseInt(sortColumn)) {
  //     case 0:
  //       column = "id";
  //       break;
  //     case 1:
  //       column = "name";
  //       break;
  //     case 2:
  //       column = "barcode";
  //       break;
  //     case 3:
  //       column = "price";
  //       break;
  //     case 4:
  //       column = "quantity";
  //       break;
  //     case 5:
  //       column = "description";
  //       break;
  //     default:
  //       column = "name"; // Default column to sort by
  //   }
  //   let order = [[column, sortDirection]];
  //   console.log(column, sortColumn);
  //   return Product.findAndCountAll({
  //     where: whereClause,
  //     order: order,
  //     offset: offset,
  //     limit: limit,
  //     //retrive all columns
  //     // attributes: [
  //     //   "id",
  //     //   "image",
  //     //   "name",
  //     //   "barcode",
  //     //   "price",
  //     //   "quantity",
  //     //   "user_id",
  //     //   "description",
  //     // ],
  //   });
  // }

  // static async addProduct(product) {
  //   return Product.create(product);
  // }

  // static editProduct(id, updatedProduct) {
  //   console.log(updatedProduct, "updated product");
  //   return Product.update(updatedProduct, {
  //     where: { id: id },
  //   });
  // }

  // static deleteProduct(id) {
  //   return Product.destroy({
  //     where: { id: id },
  //   });
  // }

  //Using Manual Queries (without using ORM)

  static async getProducts(
    userId,
    offset,
    limit,
    search,
    sortDirection,
    sortColumn
  ) {
    let whereClause = `user_id = ${userId}`;

    if (search) {
      whereClause += ` AND (name LIKE '%${search}%' OR barcode LIKE '%${search}%' OR price = '${search}' OR quantity = '${search}')`;
    }

    let column;
    switch (parseInt(sortColumn)) {
      case 0:
        column = "id";
        break;
      case 1:
        column = "name";
        break;
      case 2:
        column = "barcode";
        break;
      case 3:
        column = "price";
        break;
      case 4:
        column = "quantity";
        break;
      case 5:
        column = "description";
        break;
      default:
        column = "name"; // Default column to sort by
    }
    const order = `${column} ${sortDirection}`;

    const queryStatement = `
      SELECT *
      FROM products
      WHERE ${whereClause}
      ORDER BY ${order}
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const countQueryStatement = `
      SELECT COUNT(*) AS total_count
      FROM products
      WHERE ${whereClause}
    `;

    const [productsResult, countResult] = await Promise.all([
      query(queryStatement),
      query(countQueryStatement),
    ]);

    const rows = productsResult;
    const count = countResult[0].total_count;

    return { rows, count };
  }

  static async addProduct(product) {
    const { image, name, barcode, price, quantity, user_id, description } =
      product;
    let values = [];
    values = [image, name, barcode, price, quantity, description, user_id];
    const queryStatement = `INSERT INTO Products (image, name, barcode, price, quantity, description, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const added = await query(queryStatement, values);
    return added;
  }

  static async editProduct(id, updatedProduct) {
    const { name, barcode, price, quantity, user_id, description } =
      updatedProduct;
    const image = updatedProduct.hasOwnProperty("image")
      ? updatedProduct.image
      : null;

    let queryStatement;
    let values = [];

    if (image) {
      queryStatement = `UPDATE Products SET image=?, name=?, barcode=?, price=?, quantity=?, user_id=?, description=? WHERE id=?`;
      values = [
        image,
        name,
        barcode,
        price,
        quantity,
        user_id,
        description,
        id,
      ];
    } else {
      queryStatement = `UPDATE Products SET name=?, barcode=?, price=?, quantity=?, user_id=?, description=? WHERE id=?`;
      values = [name, barcode, price, quantity, user_id, description, id];
    }

    const edited = await query(queryStatement, values);
    return edited;
  }

  static async deleteProduct(id) {
    const queryStatement = `DELETE FROM Products WHERE id = ${id}
    `;

    const deleted = await query(queryStatement);

    return deleted;
  }
}
module.exports = ProductsRepository;
