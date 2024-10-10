const homeRouter = require("./home.route");
const urlRouter = require("./url.route");
const authRouter = require("./user.route");

module.exports = (app) => {
  app.use("/", homeRouter);
  app.use("/", urlRouter);
  app.use("/api/auth", authRouter);
};
