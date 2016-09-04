import * as path from 'path';
import webpack from 'webpack';

function createWebpackConfig(options) {
  return {
    context: path.dirname(options.entry),
    entry: `./${path.basename(options.entry).replace(/\.js$/, '')}`,
    watch: !!options.watch,

    module: {
      loaders: [
        { test: /\.json$/, loader: require.resolve('json-loader') },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: require.resolve('babel-loader'),
          query: {
            presets: require.resolve('babel-preset-extplug')
          },
        },
      ],
    },

    output: {
      path: path.dirname(options.output),
      filename: path.basename(options.output),
      libraryTarget: 'amd',
    },

    externals: [
      'jquery',
      'underscore',
      'backbone',
      'plug-modules',
      'lang/Lang',
      (context, request, cb) => {
        if (/^plug\//.test(request)) {
          cb(null, `amd plug-modules!${request}`);
        } else if (/^extplug\//.test(request)) {
          cb(null, `amd ${request}`);
        } else {
          cb();
        }
      },
    ],
  };
}

export default function build({ entry, output, ...opts }, cb) {
  const config = createWebpackConfig({
    entry,
    output,
    ...opts
  });
  webpack(config, cb);
}
