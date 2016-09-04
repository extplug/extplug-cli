import 'loud-rejection/register';
import { createReadStream, unlink } from 'fs';
import * as path from 'path';
import { tmpName } from 'tmp';
import minimist from 'minimist';
import pify from 'pify';
import build from './build';

const opts = minimist(process.argv.slice(2));
const args = opts._;
delete opts._;
const [entry, output] = args;

const pifyStream = stream => new Promise((resolve, reject) => {
  stream.on('end', resolve).on('error', reject);
});

if (output) {
  build({
    ...opts,
    entry: path.resolve(entry),
    output,
  });
} else {
  pify(tmpName)().then(name =>
    build({
      ...opts,
      entry: path.resolve(entry),
      output: `${name}.js`,
    }).then(() => pifyStream(
      createReadStream(`${name}.js`).pipe(process.stdout)
    )).then(() =>
      pify(unlink)(`${name}.js`)
    )
  );
}
