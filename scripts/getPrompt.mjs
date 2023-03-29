import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';

const resp = await axios.get('https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv');

/** @type {string} */
const csv = resp.data;

const data = csv.split('\n').map(line => {
  return (
    line
      .match(/"(.*)","(.*)"/)
      ?.slice(1)
      ?.map(s => s.replace(/""/g, '"')) || []
  );
});

const prompts = data.reduce((results, [k, v]) => (k ? { ...results, [k]: v } : results), {});
const dirname = path.dirname(import.meta.url.slice('file://'.length));

await fs.writeFile(path.join(dirname, '..', 'src', 'prompts.json'), JSON.stringify(prompts, null, 2));
