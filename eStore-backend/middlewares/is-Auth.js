const jwt = require("jsonwebtoken");

exports.verifyLogin = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
      if (err) {
        res.status(403).json({
          code: "Invalid Token!",
        });
      } else {
        req.authData = authData;
        next();
      }
    });
  } else {
    res.status(403).json({
      code: "Token missing!",
    });
  }
};
