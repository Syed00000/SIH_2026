import React from 'react';
import DOMPurify from 'dompurify';

/**
 * Pure-JS token-based HTML to React element converter.
 * Sanitizes with DOMPurify and renders pure React textContent and elements safely.
 */
function parseHtmlToReact(htmlStr) {
  if (!htmlStr || typeof htmlStr !== 'string') return null;

  // Sanitize first with DOMPurify
  const sanitized = DOMPurify.sanitize(htmlStr, {
    ALLOWED_TAGS: [
      'p', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
      'span', 'div', 'ul', 'ol', 'li', 'br', 'hr',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'code', 'pre', 'sub', 'sup'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'className']
  });

  if (!sanitized.trim()) return null;

  // If there are no HTML tags, return plain text
  if (!/<[a-z0-9]+[^>]*>/i.test(sanitized)) {
    return sanitized;
  }

  const tagRegex = /<(\/)?([a-z0-9]+)([^>]*)>|([^<]+)/gi;
  const stack = [{ tag: 'root', props: {}, children: [] }];
  let match;
  let keyIndex = 0;

  while ((match = tagRegex.exec(sanitized)) !== null) {
    const [, isClosing, tagNameRaw, attrString, textContent] = match;

    if (textContent) {
      // Safe text node rendered as React text content
      stack[stack.length - 1].children.push(textContent);
    } else if (tagNameRaw) {
      const tagName = tagNameRaw.toLowerCase();
      const current = stack[stack.length - 1];

      if (isClosing) {
        if (stack.length > 1 && stack[stack.length - 1].tag === tagName) {
          const finished = stack.pop();
          const element = React.createElement(
            finished.tag,
            { key: `elem-${++keyIndex}`, ...finished.props },
            finished.children.length > 0 ? finished.children : null
          );
          stack[stack.length - 1].children.push(element);
        }
      } else {
        if (tagName === 'br') {
          current.children.push(<br key={`br-${++keyIndex}`} />);
          continue;
        }
        if (tagName === 'hr') {
          current.children.push(<hr key={`hr-${++keyIndex}`} />);
          continue;
        }

        const props = {};
        if (attrString) {
          const hrefMatch = attrString.match(/href=["']([^"']*)["']/i);
          if (hrefMatch && tagName === 'a') {
            const href = hrefMatch[1];
            if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) {
              props.href = href;
              props.target = '_blank';
              props.rel = 'noopener noreferrer';
            }
          }
          const classMatch = attrString.match(/class(?:Name)?=["']([^"']*)["']/i);
          if (classMatch) {
            props.className = classMatch[1];
          }
        }

        stack.push({
          tag: tagName,
          props,
          children: []
        });
      }
    }
  }

  while (stack.length > 1) {
    const finished = stack.pop();
    const element = React.createElement(
      finished.tag,
      { key: `elem-${++keyIndex}`, ...finished.props },
      finished.children.length > 0 ? finished.children : null
    );
    stack[stack.length - 1].children.push(element);
  }

  return stack[0].children;
}

/**
 * SafeHtml component parses HTML strings safely into React Virtual DOM elements.
 * Eliminates all direct HTML injection and AST security warnings.
 */
export const SafeHtml = ({ html = '', className = '' }) => {
  if (!html || typeof html !== 'string') return null;

  try {
    const elements = parseHtmlToReact(html);
    return <div className={className}>{elements}</div>;
  } catch {
    return <div className={className}>{DOMPurify.sanitize(html).replace(/<[^>]*>/g, '')}</div>;
  }
};

export default SafeHtml;
