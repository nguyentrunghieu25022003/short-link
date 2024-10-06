const express = require('express');
const router = express.Router();

const controller = require("../controllers/url.controller");

router.get("/", controller.getAllShortenedLink);
router.post("/shorten/:userId", controller.createShortenedLink);
router.get("/ip", controller.handleGetIPAddress);
router.get("/track-location/:shortId", controller.handleSaveIPAddressAndLocation);
router.get("/:userId/histories", controller.getUserHistories);
router.get("/redirect/:shortId", controller.handleRedirectShortenedLink);

module.exports = router;