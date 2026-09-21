import React from 'react';
import DOMPurify from 'dompurify';

/**
 * Recursively converts DOM nodes into React elements without dangerouslySetInnerHTML
 */
function domToReact(node, key) {
  if (!node) return null;

  // Text node
  if (node.nodeType === 3) {
    return node.textContent;
  }

  // Element node
  if (node.nodeType === 1) {
    const tagName = node.tagName.toLowerCase();
    const allowedTags = [
      'p', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
      'span', 'div', 'ul', 'ol', 'li', 'br', 'hr',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'a', 'blockquote', 'code', 'pre', 'sub', 'sup'
    ];

    const children = Array.from(node.childNodes).map((child, i) => domToReact(child, `${key}-${i}`));

    if (!allowedTags.includes(tagName)) {
      return children.length === 1 ? children[0] : <React.Fragment key={key}>{children}</React.Fragment>;
    }

    const props = { key };

    if (tagName === 'a') {
      const href = node.getAttribute('href');
      if (href && (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:'))) {
        props.href = href;
        props.target = '_blank';
        props.rel = 'noopener noreferrer';
      }
    }

    const classAttr = node.getAttribute('class');
    if (classAttr) {
      props.className = classAttr;
    }

    if (tagName === 'br') {
      return <br key={key} />;
    }
    if (tagName === 'hr') {
      return <hr key={key} />;
    }

    return React.createElement(tagName, props, children.length > 0 ? children : null);
  }

  return null;
}

/**
 * SafeHtml component parses HTML strings safely into React Virtual DOM elements.
 * Eliminates all direct HTML injection and AST security warnings.
 */
export const SafeHtml = ({ html = '', className = '' }) => {
  if (!html || typeof html !== 'string') return null;

  // Sanitize first with DOMPurify
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
      'span', 'div', 'ul', 'ol', 'li', 'br', 'hr',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'a', 'blockquote', 'code', 'pre', 'sub', 'sup'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'className']
  });

  if (!clean.trim()) return null;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(clean, 'text/html');
    const nodes = Array.from(doc.body.childNodes).map((child, idx) => domToReact(child, `node-${idx}`));

    return <div className={className}>{nodes}</div>;
  } catch {
    return <div className={className}>{clean.replace(/<[^>]*>/g, '')}</div>;
  }
};

export default SafeHtml;
