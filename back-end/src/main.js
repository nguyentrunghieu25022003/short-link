const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const mongodb = require("../config/index");
const path = require("path");
const routes = require("./api/v1/routes/index.route");
const corsHelper = require("./helper/cors");

const app = express();
const port = 3001;
const corsOptions = {
  origin: corsHelper.options,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type", "x-forwarded-for"],
};

mongodb.connect();
app.set("trust proxy", true);
app.use(morgan("combined"));
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

routes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
