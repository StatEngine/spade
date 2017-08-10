/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import fs from 'fs';
import git from 'git-rev-sync';
import webpack from 'webpack';
import { dependencies as externals } from './app/package.json';

// Write git information to json file for build.
const gitState = {
  commit: git.long(),
  branch: git.branch(),
  commitDate: git.date(),
};

fs.writeFileSync('./app/git-state.json', JSON.stringify(gitState));


export default {
  externals: Object.keys(externals || {}),

  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
    },
    {
      test: /\.js$/,
      use: {
        loader: 'shebang-loader',
      },
    }],
  },

  output: {
    path: path.join(__dirname, 'app'),
    filename: 'renderer.dev.js',
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2',
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      path.join(__dirname, 'app'),
      'node_modules',
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    }),

    new webpack.NamedModulesPlugin(),
  ],
};
