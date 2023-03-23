/*
resolve: {
  alias: {
    'env.config': '/home/pedro/developer/openedx/p2/frontend-component-header/env.config'
  },
  fallback: { 'env.config': false },
  extensions: [ '.js', '.jsx', '.js', '.jsx', '.ts', '.tsx' ]
},
mode: 'development',
devtool: 'eval-source-map',
module: {
  rules: [ [Object], [Object], [Object], [Object], [Object], [Object] ]
},
optimization: { minimizer: [ '...', [ImageMinimizerPlugin] ] },
plugins: [
  CleanWebpackPlugin {
    dangerouslyAllowCleanPatternsOutsideProject: false,
    dry: false,
    verbose: false,
    cleanStaleWebpackAssets: true,
    protectWebpackAssets: true,
    cleanAfterEveryBuildPatterns: [],
    cleanOnceBeforeBuildPatterns: [Array],
    currentAssets: [],
    initialClean: false,
    outputPath: '',
    apply: [Function: bound apply],
    handleInitial: [Function: bound handleInitial],
    handleDone: [Function: bound handleDone],
    removeFiles: [Function: bound removeFiles]
  },
  MiniCssExtractPlugin {
    _sortedModulesCache: [WeakMap],
    options: [Object],
    runtimeOptions: [Object]
  },
  Dotenv { config: [Object] }
]
}
*/

const path = require('path');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const platformConfig = require('@edx/frontend-build/config/webpack.dev.config');

const config = {
  mode: process.env.NODE_ENV,
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash].css',
    }),
  ],
};

platformConfig.plugins.shift();
platformConfig.plugins.pop();
delete platformConfig.module.rules[0].use.options.plugins;
delete platformConfig.entry;
delete platformConfig.optimization;
delete platformConfig.devServer;
delete platformConfig.output;

const merged = merge(platformConfig, config);
delete merged.ignoreWarnings;

//console.log(merged);

module.exports = merged;
