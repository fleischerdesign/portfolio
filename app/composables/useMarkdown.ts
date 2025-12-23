import { marked } from 'marked';

export const useMarkdown = () => {
  const renderMarkdown = (markdownString: string | null | undefined): string => {
    if (!markdownString) {
      return '';
    }
    return marked.parse(markdownString) as string;
  };

  return {
    renderMarkdown,
  };
};
