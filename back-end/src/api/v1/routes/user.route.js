const express = require("express");
const router = express.Router();

const controller = require("../controllers/user.controller");

router.post("/register", controller.handleRegister);
router.post("/login", controller.handleLogin);

module.exports = router;
