import { useEffect } from 'react';

export interface UseScrollToOptions {
  smooth?: unknown[];
  instant?: unknown[];
}

export function useScrollToBottom({ smooth, instant }: UseScrollToOptions) {
  useEffect(() => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  }, [smooth]);

  useEffect(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
  }, [instant]);
}
