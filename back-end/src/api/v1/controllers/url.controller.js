const axios = require("axios");
const cheerio = require("cheerio");
const shortid = require("shortid");
const Url = require("../../../models/url.model");

module.exports.createShortenedLink = async (req, res) => {
  try {
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

module.exports.handleGetLocation = async (req, res) => {
  try {
    const { shortId } = req.params;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.ip;
    const locationResponse = await axios.get(`https://get.geojs.io/v1/ip/geo/${ip}.json`);
    const locationInfo = locationResponse.data;

    const urlData = await Url.findOne({ shortId: shortId });
    urlData.visits.push({
      ip: ip,
      location: locationInfo,
      timestamp: Date.now(),
    });
    urlData.save();

    res.status(200).json({ locationInfo });
  } catch (err) {
    res.status(500).send("Error creating link: " + err.message);
  }
};