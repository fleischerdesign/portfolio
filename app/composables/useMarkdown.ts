import { marked } from 'marked';

// You can configure marked globally here if needed.
// For example, to add extensions or change options.

export const useMarkdown = () => {
  /**
   * Renders a Markdown string to HTML.
   * @param markdownString The string to render.
   * @returns The rendered HTML string.
   */
  const renderMarkdown = (markdownString: string | null | undefined): string => {
    if (!markdownString) {
      return '';
    }
    // marked.parse returns a string or a promise, but in sync mode it's a string.
    // The type casting `as string` handles the type ambiguity.
    return marked.parse(markdownString) as string;
  };

  return {
    renderMarkdown,
  };
};
