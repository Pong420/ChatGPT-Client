import Fuse from 'fuse.js';
import prompts from '@/prompts.json';

export const fuse = new Fuse(Object.keys(prompts));

export const searchPrompts = (keyword: string) =>
  fuse.search(keyword).map(k => ({ key: k.item, value: prompts[k.item as keyof typeof prompts] }));

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
