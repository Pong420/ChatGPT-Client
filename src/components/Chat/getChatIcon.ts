import type { Prompt } from '@/utils/prompts';
import {
  IconBrandJavascript,
  IconBrandPython,
  IconMessage2,
  IconMessageLanguage,
  type TablerIconsProps
} from '@tabler/icons-react';

export function getChatIcon(_prompt?: string | null): React.ComponentType<TablerIconsProps> {
  const prompt = _prompt as Prompt;
  switch (prompt) {
    case 'English Translator and Improver':
    case 'English Pronunciation Helper':
    case 'Spoken English Teacher and Improver':
      return IconMessageLanguage;
    case 'JavaScript Console':
      return IconBrandJavascript;
    case 'Python interpreter':
    case 'Python Interpreter':
      return IconBrandPython;
    default:
      return IconMessage2;
  }
}
