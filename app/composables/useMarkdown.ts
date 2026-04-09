import { Marked } from 'marked';

/**
 * @composable useMarkdown
 * @description Composable for rendering markdown content using an isolated Marked instance.
 */
export const useMarkdown = () => {
  // Create an isolated instance to prevent recursion and global state pollution
  const marked = new Marked({
    renderer: {
      code(token) {
        if (token.lang === 'mermaid') {
          return `<pre class="mermaid">${token.text}</pre>`;
        }
        return false; // use default
      }
    }
  });

  /**
   * @method render
   * @description Parses markdown string to HTML.
   */
  const render = (content: string): string => {
    if (!content) return '';
    try {
      return marked.parse(content) as string;
    } catch (error) {
      console.error('Markdown parsing error:', error);
      return content;
    }
  };

  return {
    render
  };
};
