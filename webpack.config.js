const path = require("path");

module.exports = {
  target: "node",
  mode: "development",
  entry: {
    entry: "./scripts/display.js",
  },
  devtool: "eval",
  output: {
    filename: "display.js",
    path: path.resolve(__dirname, "./public"),
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
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
};
