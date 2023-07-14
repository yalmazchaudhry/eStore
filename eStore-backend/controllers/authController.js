const authService = require("../services/authService");

class AuthController {
  postLogin = (req, res, next) => {
    authService
      .postLogin(req, res, next)
      .then((result) => {
        res.status(200).json({
          message: "LogIn successfully!",
          token: result.token,
          userId: result.userId,
        });
      })
      .catch((err) => {
        res.status(err.status).json({ status: err.status, error: err.error });
      });
  };
  postSignUp = (req, res, next) => {
    authService
      .postSignUp(req, res, next)
      .then((user) => {
        res.status(200).json({
          message: "User created successfully!",
          // user: user,
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: "Error creating user!",
          // err: err.errors[0].message,
          error: err,
        });
      });
  };
}

module.exports = new AuthController();
