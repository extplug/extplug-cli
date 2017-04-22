# extplug-cli

[![Greenkeeper badge](https://badges.greenkeeper.io/extplug/extplug-cli.svg)](https://greenkeeper.io/)

CLI for easily bundling ExtPlug plugins.

## Installation

```bash
npm install --global extplug-cli
```

## Usage

```bash
extplug bundle /path/to/my/plugin.js bundled-plugin.js
```

```
extplug [options] [command]


Commands:

  init                               Scaffold a new plugin in the current directory.
  bundle [options] <entry> [output]  Bundle a plugin.
  watch <entry> <output>             Bundle a plugin. Rebuild automatically when source files change.

Options:

  -h, --help     output usage information
  -V, --version  output the version number

```

### Babel Preset

The Babel preset used by the ExtPlug CLI is available as `extplug-cli/babel`.
This is useful if you need to transpile your code outside of bundling, like when
running tests.

For example, with [Ava](https://github.com/avajs/ava):

```js
// .babelrc
{
  "presets": ["extplug-cli/babel"]
}
```

```js
// package.json
{
  "ava": {
    "require": ["babel-register"],
    "babel": "inherit"
  }
}
```

## License

[MIT]

[MIT]: ./LICENSE
