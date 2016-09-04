import 'loud-rejection/register';
import minimist from 'minimist';
import { build } from './';

const opts = minimist(process.argv.slice(2));
const args = opts._;
delete opts._;
const [entry, output] = args;

build({
  ...opts,
  entry,
  output,
});
