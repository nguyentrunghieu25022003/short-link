const express = require("express");
const router = express.Router();

const controller = require("../controllers/user.controller");
const authenticateToken = require("../../../middlewares/authenticate");

router.post("/sign-up", controller.handleSignUp);
router.post("/sign-in", controller.handleSignIn);
router.get("/check-token", controller.handleCheckToken);
router.get("/log-out", authenticateToken, controller.handleLogOut);

module.exports = router;