/**
 * Markdown Renderer - OWNS conversion of markdown text to React elements
 * 
 * Responsibilities:
 * - Converts markdown syntax to React elements
 * - Handles bold text (**text**)
 * - Handles links [text](url)
 * - Applies appropriate CSS classes
 * 
 * Does NOT:
 * - Handle business logic
 * - Manage content resolution
 * - Perform data transformations
 * 
 * @module utils/markdown/markdownRenderer
 */

import React from 'react';

/**
 * Simple markdown renderer for basic formatting
 * Supports:
 * - Bold text: **text**
 * - Links: [text](url)
 */
export function renderMarkdown(text: string): React.ReactNode {
  // Handle bold text **text**
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return React.createElement('strong', { key: index }, part.slice(2, -2));
    }
    // Handle links [text](url)
    const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/g);
    if (linkMatch) {
      return part.split(/(\[[^\]]+\]\([^)]+\))/g).map((linkPart, linkIndex) => {
        const match = linkPart.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (match) {
          return React.createElement(
            'a',
            {
              key: `${index}-${linkIndex}`,
              href: match[2],
              className: 'usa-link usa-link--external',
              rel: 'noreferrer',
              target: '_blank'
            },
            match[1]
          );
        }
        return linkPart;
      });
    }
    return part;
  });
}

/**
 * Get the text value from a string or structured description
 * Used for rendering markdown from language strings
 */
export function getMarkdownText(value: string | { text?: string }): string {
  if (typeof value === 'string') {
    return value;
  }
  return value.text || '';
}

