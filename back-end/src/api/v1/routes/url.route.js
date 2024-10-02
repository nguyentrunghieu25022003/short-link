const express = require('express');
const router = express.Router();

const controller = require("../controllers/url.controller");

router.post("/shorten", controller.createShortenedLink);
router.post("/location", controller.handleGetLocation);

module.exports = router;