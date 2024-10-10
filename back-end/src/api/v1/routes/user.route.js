const express = require("express");
const router = express.Router();

const controller = require("../controllers/user.controller");
const authenticate = require("../../../middlewares/authenticate");

router.post("/sign-up", controller.handleSignUp);
router.post("/sign-in", controller.handleSignIn);
router.get("/check-token", authenticate, controller.handleCheckToken);
router.get("/log-out", controller.handleLogOut);

module.exports = router;