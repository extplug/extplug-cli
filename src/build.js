import * as path from 'path';
import webpack from 'webpack';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';

function createWebpackConfig(options) {
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

  return {
    context: path.dirname(options.entry),
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
            require.resolve('css-loader'),
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
            options: { presets: [require.resolve('../babel')] },
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
