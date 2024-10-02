const urlRouter = require("./url.route");
const authRouter = require("./user.route");

module.exports = (app) => {
    app.use("/", async (req, res) => {
        res.send("Server listening...");
    })
    app.use("/api/url", urlRouter);
    app.use("/api/auth", authRouter);
};