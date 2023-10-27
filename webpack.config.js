const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const path = require("path");
const sveltePreprocess = require("svelte-preprocess");

const mode = process.env.NODE_ENV || "development";
const prod = mode === "production";
console.log("mode", mode);
module.exports = {
  target: "web",
  entry: {
    app: {
      import: ["./src/main.ts"],
    },
  },
  resolve: {
    alias: {
      svelte: path.resolve("node_modules", "svelte/src/runtime"),
    },
    extensions: [".mjs", ".js", ".ts", ".svelte"],
    mainFields: ["svelte", "browser", "module", "main"],
    conditionNames: ["svelte"],
  },
  output: {
    path: path.join(__dirname, "public", "build"),
    filename: "[name].bundle.js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: {
            compilerOptions: {
              dev: !prod,
            },
            emitCss: prod,
            hotReload: !prod,
            preprocess: sveltePreprocess({
              sourceMap: !prod,
            }),
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: !prod,
              url: false,
            },
          },
        ],
      },
      {
        // required to prevent errors from Svelte on Webpack 5+
        test: /node_modules\/svelte\/.*\.mjs$/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  mode,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new ESLintPlugin(),
  ],
  //   TODO - Optimize Webpack devtool configuration
  devtool: prod ? false : "source-map",
  devServer: {
    hot: true,
    devMiddleware: {
      publicPath: "/build",
    },
  },
};
