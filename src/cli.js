import 'loud-rejection/register';
import program from 'commander';
import chalk from 'chalk';
import { build, watch } from './';
import init from './init';
import { version } from '../package.json';

function onError(err) {
  console.log(err.stack);
}

program
  .version(version)
  .description('ExtPlug plugin development kit.');

program
  .command('init')
  .description('Scaffold a new plugin in the current directory.')
  .action(() => {
    init({}).catch(onError);
  });

program
  .command('bundle <entry> [output]')
  .description('Bundle a plugin.')
  .option('--minify', 'minify bundle output', false)
  .action((entry, output, options) => {
    build({
      ...options,
      entry,
      output,
    })
      .then(() => {
        console.log(chalk.green('Compiled successfully.'));
      })
      .catch((errors) => {
        console.log(chalk.red('Failed to compile.'));
        console.log();

        errors.forEach((err) => {
          console.log(err.message);
        });
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
