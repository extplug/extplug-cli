import Environment from 'yeoman-environment';
import pify from 'pify';

export default function init(opts = {}) {
  const env = Environment.createEnv();
  const run = pify(env.run.bind(env));
  env.register(require.resolve('generator-extplugin'));
  return run('extplugin', opts);
}
