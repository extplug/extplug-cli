import 'loud-rejection/register';
import program from 'commander';
import { build, watch } from './';
import init from './init';
import { version } from '../package.json';

program
  .version(version)
  .description('ExtPlug plugin development kit.');

program
  .command('init')
  .description('Scaffold a new plugin in the current directory.')
  .action(() => init({}));

program
  .command('bundle <entry> [output]')
  .description('Bundle a plugin.')
  .option('--minify', 'minify bundle output', false)
  .action((entry, output, options) => {
    build({
      ...options,
      entry,
      output,
    });
  });

program
  .command('watch <entry> <output>')
  .description('Bundle a plugin. Rebuild automatically when source files change.')
  .action((entry, output) => {
    watch({
      entry,
      output,
    });
  });

program.parse(process.argv);
