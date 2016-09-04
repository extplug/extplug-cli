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
  tmpName((tmpErr, name) => {
    if (tmpErr) throw tmpErr;
    build({
      entry: path.resolve(entry),
      output: `${name}.js`,
    }, buildErr => {
      if (buildErr) throw buildErr;
      createReadStream(`${name}.js`)
        .pipe(process.stdout)
        .on('end', () => {
          unlink(`${name}.js`, () => {});
        });
    });
  });
}
