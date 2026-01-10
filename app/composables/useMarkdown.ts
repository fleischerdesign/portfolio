import { marked } from 'marked';

export const useMarkdown = () => {
  const render = (content: string) => {
    if (!content) return '';
    return marked.parse(content);
  };

  return {
    render
  };
};