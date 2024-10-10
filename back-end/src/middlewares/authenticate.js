const jwt = require("jsonwebtoken");
const { createAccessToken } = require("./jwt");

const authenticateToken = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  if (accessToken === undefined && refreshToken === undefined) {
    return res.status(401).json({ message: "No token provided." });
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" && refreshToken) {
      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const newAccessToken = createAccessToken(decodedRefresh.id);
        console.log("Created new access token !");
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          secure: process.env.NODE_ENV === "production",
          sameSite: "None",
          path: "/"
        });
        req.user = jwt.verify(newAccessToken, process.env.JWT_ACCESS_SECRET);
        return next();
      } catch (error) {
        return res.status(403).json({ message: "Invalid session, please log in again." });
      }
    }
    return res.status(403).json({ message: "Invalid token." });
  }
};

module.exports = authenticateToken;