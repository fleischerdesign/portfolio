import { marked } from 'marked';

/**
 * @composable useMarkdown
 * @description Composable for rendering markdown content using marked.
 * Includes a custom renderer extension for mermaid diagrams.
 */
export const useMarkdown = () => {
  // Configure marked with a custom renderer for mermaid
  // This ensures mermaid code blocks are rendered as <pre class="mermaid">
  marked.use({
    renderer: {
      code({ text, lang }) {
        if (lang === 'mermaid') {
          return `<pre class="mermaid">${text}</pre>`;
        }
        // Fallback to default renderer for other languages
        return false;
      }
    }
  });

  /**
   * @method render
   * @description Parses markdown string to HTML.
   */
  const render = (content: string) => {
    if (!content) return '';
    return marked.parse(content) as string;
  };

  return {
    render
  };
};
