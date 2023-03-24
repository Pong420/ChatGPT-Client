import nextEnv from '@next/env';
import { spawn as _spawn } from './spawn.mjs';

nextEnv.loadEnvConfig(process.cwd());

const { env } = await import('../src/env.mjs');

/**
 * @param {string} commands
 * @returns
 */
const spawn = commands => {
  // print the command, this is helpful for create
  console.log(`\`\`\`\n${commands.replace(/ --?\w+/g, s => ' \\\n ' + s)}\n\`\`\``);
  const [command = '', ...args] = commands.trim().split(' ');
  return _spawn(command, args);
};

const envArgs = Object.entries(env)
  .filter(([k]) => !['NODE_ENV', 'NEXTAUTH_URL'].includes(k))
  .map(([k, v]) => `-e ${k}=${v}`);

const [, , command] = process.argv;

switch (command) {
  case 'build':
    spawn(`docker build --tag chatgpt .`);
    break;
  case 'run':
    spawn(`docker run --name chatgpt -p 3000:3000 ${envArgs.join(' ')} -it chatgpt`);
    break;
  case 'remote':
    spawn(`docker run --name chatgpt -p 3000:3000 ${envArgs.join(' ')} -it ghcr.io/pong420/chat-gpt-client:latest`);
    break;
  default:
    throw new Error('unknown command ${command}');
}
