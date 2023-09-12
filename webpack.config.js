/*
Ideally the webpack config goes with the other platform configs in frontend-build.
To avoid premature changes to that library, we are crafting/hacking what we need
by removing incompatible configurations form webpack.dev.config.

SEE https://github.com/openedx/frontend-build/pull/436
*/
/*
const path = require('path');
const { createConfig } = require('@edx/frontend-build');

const config =  createConfig('webpack-piral', {
  entry: {
    app: path.resolve(process.cwd(), './src/index.html'),
  },
});

delete config.output;
console.log(config);
*/
const path = require('path');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const platformConfig = require('@edx/frontend-build/config/webpack.dev.config');

const config = {
  entry: {
    app: path.resolve(process.cwd(), './src/index.html'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/webpack.pilet.config.js", to: "./" },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash].css',
    }),
  ],
};

platformConfig.plugins.shift();
delete platformConfig.optimization;
delete platformConfig.devServer;
delete platformConfig.module;
delete platformConfig.output;

const merged = merge(platformConfig, config);
delete merged.ignoreWarnings;

//console.log(merged);

module.exports = merged;
