import { config } from 'dotenv';
import { spawn as _spawn } from './spawn.mjs';

const env = config({ path: '.env' });

Object.assign(process.env, { ...env, NODE_ENV: 'production' });

await import('../src/env.mjs');

/**
 * @param {string} commands
 * @returns
 */
const spawn = commands => {
  const [command = '', ...args] = commands.trim().split(' ');
  return _spawn(command, args);
};

const envArgs = ['NEXTAUTH_URL', `NEXTAUTH_SECRET`, `OPENAI_API_KEY`, `DATABASE_URL`].map(
  k => `-e ${k}=${process.env[k]}`
);

spawn(`docker run --name chatgpt -p 3000:3000 ${envArgs.join(' ')} -it chatgpt`);
