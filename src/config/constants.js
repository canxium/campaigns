const path = require("path");
const env = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
require("dotenv").config({
  path: path.join(__dirname, "../../" + env),
});

module.exports = Object.freeze({
});
