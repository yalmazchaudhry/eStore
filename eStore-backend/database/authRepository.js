const { Op } = require("sequelize");
const User = require("../models/user");
const query = require("../config/dbConfigSimple");

class AuthRepository {
  // static async getUserByEmailOrUsername(identifier) {
  //   return User.findOne({
  //     where: {
  //       [Op.or]: [{ email: identifier }, { username: identifier }],
  //     },
  //   });
  // }

  static async getUserByEmailOrUsername(identifier) {
    let queryStatement =
      "SELECT `id`, `username`, `email`, `password`, `phone` FROM `Users` AS `User` WHERE (`User`.`email` = ? OR `User`.`username` = ?) LIMIT 1";
    const values = [identifier, identifier];
    const authenticated = await query(queryStatement, values);
    return authenticated[0];
  }

  static async createUser(user) {
    const queryStatement = `INSERT INTO Users (username, email, password, phone) VALUES (?, ?, ?, ?)`;
    const values = [user.username, user.email, user.password, user.phone];
    return await query(queryStatement, values);
  }

  // static async createUser(user) {
  //   return User.create({
  //     username: user.username,
  //     email: user.email,
  //     password: user.password,
  //     phone: user.phone,
  //   });
  // }
}
module.exports = AuthRepository;
