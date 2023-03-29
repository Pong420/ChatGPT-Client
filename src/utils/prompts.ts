import Fuse from 'fuse.js';
import prompts from '@/prompts.json';

export type PromptSearchResult = ReturnType<typeof searchPrompts>[number];

const fuse = new Fuse(Object.keys(prompts), { includeMatches: true, ignoreLocation: true });

export const searchPrompts = (keyword: string) => fuse.search(keyword).map(k => ({ ...k, value: `/${k.item}` }));

export const isPromptCommand = (content: string) => {
  const [, system] = content.trim().match(/^\/(.*)/) || [];

  if (system && prompts[system as keyof typeof prompts]) {
    return system;
  }
};

export const getPrompt = (k: string) => {
  const key = (isPromptCommand(k) || k) as keyof typeof prompts;
  return prompts[key];
};
