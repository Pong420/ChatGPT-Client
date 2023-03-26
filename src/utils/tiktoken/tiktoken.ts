import { PythonShell } from 'python-shell';
import tokenizerPy from './tokenizer.py';
import { DefalutChatGPTModel } from '@/constant';

export interface TiktokenOptions {
  model?: string;
  content: string;
}

export function tiktoken({ content, model = DefalutChatGPTModel }: TiktokenOptions) {
  const scripts = tokenizerPy
    .replace("'__model__'", JSON.stringify(model))
    .replace("'__content__'", JSON.stringify(content));

  return new Promise<number>((resolve, reject) => {
    PythonShell.runString(scripts)
      .then(([message]) => {
        resolve((JSON.parse(message as string) as number[]).length);
      })
      .catch(reject);
  });
}
