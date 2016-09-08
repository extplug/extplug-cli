import * as path from 'path';
import pify from 'pify';
import webpack from 'webpack';
import cssnext from 'postcss-cssnext';

function createWebpackConfig(options) {
  return {
    context: path.dirname(options.entry),
    entry: `./${path.basename(options.entry).replace(/\.js$/, '')}`,
    watch: !!options.watch,

    module: {
      loaders: [
        { test: /\.json$/, loader: require.resolve('json-loader') },
        {
          test: /\.css$/,
          loaders: [
            require.resolve('css-loader'),
            require.resolve('postcss-loader'),
          ],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: require.resolve('babel-loader'),
          query: {
            presets: require.resolve('babel-preset-extplug'),
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
      'meld',
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

    plugins: [
      options.minify && new webpack.optimize.UglifyJsPlugin(),
    ].filter(Boolean),

    postcss() {
      return [cssnext()];
    },
  };
}

export default function build({ entry, output, ...opts }) {
  const config = createWebpackConfig({
    entry,
    output,
    ...opts,
  });

  const compiler = webpack(config);
  return pify(compiler.run.bind(compiler))();
}
