/**
 * A Babel preset for ExtPlug plugins. Can be used eg. for tests.
 */

module.exports = {
  presets: [
    [require.resolve('babel-preset-extplug'), {
      amd: false,
    }],
  ],
};
