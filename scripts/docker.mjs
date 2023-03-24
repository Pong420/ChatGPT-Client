import nextEnv from '@next/env';
import { spawn as _spawn } from './spawn.mjs';

nextEnv.loadEnvConfig(process.cwd());

const { env } = await import('../src/env.mjs');

/**
 * @param {string} commands
 * @returns
 */
const spawn = commands => {
  const [command = '', ...args] = commands.trim().split(' ');
  return _spawn(command, args);
};

const envArgs = Object.entries(env)
  .filter(([k]) => k !== 'NODE_ENV')
  .map((k, v) => `-e ${k}=${v}`);

const [, , command] = process.argv;

switch (command) {
  case 'build':
    spawn(`docker build --tag chatgpt .`);
    break;
  case 'run':
    spawn(`docker run --name chatgpt -p 3000:3000 ${envArgs.join(' ')} -it chatgpt`);
    break;
  default:
    throw new Error('unknown command ${command}');
}
