const express = require("express");
const router = express.Router();

const controller = require("../controllers/user.controller");
const authenticateToken = require("../../../middlewares/authenticate");

router.post("/sign-up", controller.handleSignUp);
router.post("/sign-in", controller.handleSignIn);
router.get("/check-token", authenticateToken, controller.handleCheckToken);
router.get("/refresh-token", controller.releaseAccessToken);
router.get("/log-out", authenticateToken, controller.handleLogOut);

module.exports = router;