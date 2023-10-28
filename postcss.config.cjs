const tailwind = require("tailwindcss");
const tailwindConfig = require("./tailwind.config.cjs");
const autoprefixer  = require("autoprefixer");
module.exports =  {
  plugins: [tailwind(tailwindConfig), autoprefixer],
};
