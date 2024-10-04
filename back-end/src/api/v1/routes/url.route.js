const express = require('express');
const router = express.Router();

const controller = require("../controllers/url.controller");

router.post("/shorten", controller.createShortenedLink);
router.get("/:shortId", controller.handleGetLocation);

module.exports = router;