const { resolve } = require("path");
const ES3Plugin = require("./index");

module.exports = {
  entry: "./test/index.js",
  output: {
    path: resolve(__dirname, "dist"),
    filename: "app.js",
  },
  optimization: {
    minimize: false,
  },
  mode: "production",
  plugins: [new ES3Plugin()],
};
