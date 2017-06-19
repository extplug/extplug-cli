import { Buffer } from 'buffer';
import path from 'path';
import webpack from 'webpack';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';
import chalk from 'chalk';
import findBabelConfig from 'find-babel-config';
import uuid from 'uuid';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

// Turn a UUID Buffer into a valid JS identifier.
function stringifyId(id) {
  return id
    .toString('base64')
    .replace(/=+$/, '')
    .replace(/\+/g, '$')
    .replace(/\//g, '_');
}

function createWebpackConfig(options) {
  const basedir = process.cwd();

  function postcssPlugins() {
    if (options.minify) {
      return [
        cssnext({
          features: {
            autoprefixer: false,
          },
        }),
        cssnano({
          zindex: false,
        }),
      ];
    }
    return [cssnext()];
  }

  const id = Buffer.alloc(16);
  uuid.v4(null, id);

  const context = path.dirname(path.resolve(basedir, options.entry));

  const { config } = findBabelConfig.sync(context);
  if (config) {
    console.log(chalk.dim('Using custom Babel configuration.'));
  }

  return {
    context,
    entry: `./${path.basename(options.entry).replace(/\.js$/, '')}`,
    watch: !!options.watch,

    module: {
      rules: [
        {
          test: /\.json$/,
          use: require.resolve('json-loader'),
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: require.resolve('css-loader'),
              options: { importLoaders: 1 },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: { plugins: postcssPlugins },
            },
          ],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: require.resolve('babel-loader'),
            options: config || { presets: [require.resolve('../babel')] },
          },
        },
      ],
    },

    output: {
      path: path.dirname(path.resolve(basedir, options.output)),
      filename: path.basename(options.output),
      jsonpFunction: `jsonp${stringifyId(id)}`,
      libraryTarget: 'amd',
    },

    externals: [
      'jquery',
      'underscore',
      'backbone',
      'plug-modules',
      'meld',
      'lang/Lang',
      (_, request, cb) => {
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
      options.minify && new UglifyJsPlugin(),
      options.minify && new webpack.optimize.ModuleConcatenationPlugin()
    ].filter(Boolean),
  };
}

export default function build({ entry, output, ...opts }) {
  const config = createWebpackConfig({
    entry,
    output,
    ...opts,
  });

  return new Promise((resolve, reject) => {
    webpack(config).run((err, stats) => {
      if (err) {
        reject([err]);
      } else if (stats.compilation.errors.length > 0) {
        reject(stats.compilation.errors);
      } else {
        resolve(stats);
      }
    });
  });
}
