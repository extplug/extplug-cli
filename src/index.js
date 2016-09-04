import { createReadStream, unlink } from 'fs';
import * as path from 'path';
import { tmpName } from 'tmp';
import build from './build';

const [entry, output] = process.argv.slice(2);

if (output) {
  build({
    entry: path.resolve(entry),
    output,
  });
} else {
  tmpName((err, name) => {
    build({
      entry: path.resolve(entry),
      output: `${name}.js`,
    }, (err, result) => {
      if (err) throw err;
      createReadStream(`${name}.js`)
        .pipe(process.stdout)
        .on('end', () => {
          unlink(`${name}.js`, () => {});
        });
    });
  });
}
