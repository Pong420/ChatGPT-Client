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
    // if (messages.isSuccess) {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
    // }
  }, [instant]);
}
