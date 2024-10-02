const jwt = require("jsonwebtoken");

const createAccessToken = (userId) => {
  const accessTokenSecret = process.env.JWT_ACCESS_SECRET || "access_fallback_secret";
  return jwt.sign({ userId }, accessTokenSecret, { expiresIn: "24h" });
};

const createRefreshToken = (userId) => {
  const refreshTokenSecret = process.env.JWT_REFRESH_SECRET || "refresh_fallback_secret";
  return jwt.sign({ userId }, refreshTokenSecret, { expiresIn: "1y" });
};

module.exports = { createAccessToken, createRefreshToken };
