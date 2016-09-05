# [WIP Do Not Use] extplug-cli

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

## License

[MIT]

[MIT]: ./LICENSE
