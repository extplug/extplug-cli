import { createReadStream, unlink } from 'fs';
import * as path from 'path';
import pify from 'pify';
import { tmpName } from 'tmp';
import makeBundle from './build';

const pifyStream = stream =>
  new Promise((resolve, reject) => {
    stream.on('end', resolve).on('error', reject);
  });

export function build({ entry, output, ...opts }) {
  if (output) {
    return makeBundle({
      ...opts,
      entry: path.resolve(entry),
      output,
    });
  }

  return pify(tmpName)().then(name =>
    makeBundle({
      ...opts,
      entry: path.resolve(entry),
      output: `${name}.js`,
    })
      .then(() =>
        pifyStream(createReadStream(`${name}.js`).pipe(process.stdout)))
      .then(() => pify(unlink)(`${name}.js`)));
}

export function watch(opts) {
  return build({
    ...opts,
    watch: true,
  });
}
