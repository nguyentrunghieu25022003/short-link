const axios = require("axios");
const cheerio = require("cheerio");
const shortid = require("shortid");
const Url = require("../../../models/url.model");
const { getClientIP } = require("../../../helper/clientIP");

module.exports.getAllShortenedLink = async (req, res) => {
  try {
    const urls = await Url.find({});
    res.status(200).json(urls);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

module.exports.createShortenedLink = async (req, res) => {
  try {
    const { userId } = req.params;
    const { originalUrl } = req.body;
    const shortId = shortid.generate();
    const shortUrl = `${req.headers.host}/${shortId}`;

    const response = await axios.get(originalUrl);
    const html = response.data;
    const $ = cheerio.load(html);
    const title = $("title").text() || null;
    const description = $('meta[name="description"]').attr("content") || $('meta[property="og:description"]').attr("content") || $('meta[name="twitter:description"]').attr("content") || null;
    const thumbnail = $('meta[property="og:image"]').attr("content") || null;

    const newUrl = new Url({
      userId: userId,
      originalUrl: originalUrl,
      shortId: shortId,
      title: title,
      description: description,
      thumbnail: thumbnail,
    });
    await newUrl.save();

    const acceptHeader = req.headers.accept || "";

    if (acceptHeader.includes("application/json")) {
      res.status(200).json({
        shortId: shortId,
        shortUrl: shortUrl,
        title: title,
        description: description,
        thumbnail: thumbnail,
      });
    } else {
      res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta property="og:title" content="${title}" />
            <meta property="og:description" content="${description}" />
            <meta property="og:image" content="${thumbnail}" />
            <meta property="og:url" content="${shortUrl}" />
            <meta property="og:type" content="website" />
            <title>${title}</title>
          </head>
          <body>
            <h1>${title}</h1>
            <p>${description}</p>
            <img src="${thumbnail}" alt="Thumbnail" />
          </body>
        </html>
      `);
    }
  } catch (err) {
    res.status(500).send("Error creating link: " + err.message);
  }
};

module.exports.handleGetIPAddress = async (req, res) => {
  try {
    const ip = getClientIP(req);
    res.status(200).json({ ip });
  } catch (err) {
    res.status(500).send("Error get IP: " + err.message);
  }
};

module.exports.handleSaveIPAddressAndLocation = async (req, res) => {
  try {
    const { shortId } = req.params;
    const ip = getClientIP(req);
    const base64Location = req.query.data;
    const decodedLocation = atob(base64Location);
    const locationData = JSON.parse(decodedLocation);

    const url = await Url.findOne({ shortId: shortId });
    url.visits.push({
      ip: ip,
      location: locationData
    });
    await url.save();

    res.setHeader("Content-Type", "image/png");
    res.status(200).send(Buffer.from([]));
  } catch (err) {
    res.status(500).send("Error save location: " + err.message);
  }
};

module.exports.getUserHistories = async (req, res) => {
  try {
    const { userId } = req.params;
    const urls = await Url.find({ userId: userId });
    res.status(200).send(urls);
  } catch (err) {
    res.status(500).send("Error get user histories: " + err.message);
  }
};