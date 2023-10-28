const path = require("path");

module.exports = {
  target: "node",
  mode: "development",
  entry: {
    entry: "./scripts/display.js",
  },
  devtool: "inline-source-map",
  output: {
    filename: "display.js",
    path: path.resolve(__dirname, "./public/scripts"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
