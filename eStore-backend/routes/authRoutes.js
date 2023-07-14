const express = require("express");

const authController = require("../controllers/authController");
const upload = require("../helpers/upload");

const router = express.Router();

//login
router.post("/login", upload.none(), authController.postLogin);
//signUp
router.post("/signUp", upload.none(), authController.postSignUp);

module.exports = router;
