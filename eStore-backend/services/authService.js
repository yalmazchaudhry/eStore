const jwt = require("jsonwebtoken");
const authRepository = require("../database/authRepository");

class AuthService {
  static postLogin = (req, res, next) => {
    const password = req.body.userPassword;
    const identifier = req.body.userEmailorUserName;
    return new Promise((resolve, rej) => {
      authRepository
        .getUserByEmailOrUsername(identifier)
        .then((user) => {
          // Verify the user
          if (!user) {
            rej({ status: 404, error: "user not found" });
          }
          // Verify the password
          else if (password === user.password) {
            jwt.sign(
              { identifier: identifier },
              process.env.SECRET_KEY,
              // { expiresIn: "4000s" },
              (err, token) => {
                console.log(user.id);
                resolve({ token: token, userId: user.id });
              }
            );
          } else {
            rej({ status: 401, error: "invalid password" });
          }
        })
        .catch((err) => {
          rej(err);
        });
    });
  };

  static postSignUp = (req, res, next) => {
    const user = {
      email: req.body.userEmail,
      password: req.body.userPassword,
      phone: req.body.userPhone,
      username: req.body.userName,
    };

    return new Promise((resolve, rej) => {
      authRepository
        .createUser(user)
        .then((user) => {
          resolve(user);
        })
        .catch((err) => {
          rej(err);
        });
    });
  };
}
module.exports = AuthService;
