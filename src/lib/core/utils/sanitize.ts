// Node type constants for browser and server compatibility
const NODE_TYPES = {
  ELEMENT_NODE: 1,
  ATTRIBUTE_NODE: 2,
  TEXT_NODE: 3,
  COMMENT_NODE: 8
};

// Type definitions for allowed tags and attributes
interface AllowedTags {
  [key: string]: string[];
}

// Allowed HTML tags and their allowed attributes
const ALLOWED_TAGS: AllowedTags = {
  'a': ['href', 'target', 'rel', 'class', 'style'],
  'b': ['class', 'style'],
  'i': ['class', 'style'],
  'em': ['class', 'style'],
  'strong': ['class', 'style'],
  'p': ['class', 'style'],
  'br': ['class', 'style'],
  'ul': ['class', 'style'],
  'ol': ['class', 'style'],
  'li': ['class', 'style'],
  'h1': ['class', 'style'],
  'h2': ['class', 'style'],
  'h3': ['class', 'style'],
  'h4': ['class', 'style'],
  'h5': ['class', 'style'],
  'h6': ['class', 'style'],
  'span': ['class', 'style'],
  'div': ['class', 'style']
};

// Forbidden attributes that could contain JavaScript
const FORBID_ATTR = ['onclick', 'onerror', 'onload', 'onmouseover'];

// Create a safe HTML document for server-side rendering
async function createSafeDocument(): Promise<Document> {
  if (typeof window !== 'undefined') {
    return document.implementation.createHTMLDocument('sanitize');
  }

  try {
    // For server-side rendering - use dynamic import
    const { JSDOM } = await import('jsdom');
    const dom = new JSDOM('');
    return dom.window.document.implementation.createHTMLDocument('sanitize');
  } catch (error) {
    console.error('Failed to initialize JSDOM:', error);
    // Fallback to a basic document if JSDOM fails to load
    const { JSDOM } = await import('jsdom');
    const dom = new JSDOM('');
    return dom.window.document.implementation.createHTMLDocument('sanitize');
  }
}

// Sanitize attributes
function sanitizeAttributes(element: Element): void {
  const attributes = Array.from(element.attributes);
  const tagName = element.tagName.toLowerCase();
  const allowedAttrs = ALLOWED_TAGS[tagName] || [];

  for (const attr of attributes) {
    const attrName = attr.name.toLowerCase();

    // Remove forbidden attributes
    if (FORBID_ATTR.includes(attrName)) {
      element.removeAttribute(attrName);
      continue;
    }

    // Only keep allowed attributes for this tag
    if (!allowedAttrs.includes(attrName)) {
      element.removeAttribute(attrName);
      continue;
    }

    // Make sure links are safe
    if ((attrName === 'href' || attrName === 'src') && element.getAttribute(attrName)?.toLowerCase().startsWith('javascript:')) {
      element.removeAttribute(attrName);
    }
  }
}

// Sanitize HTML content
function sanitizeNode(node: any, doc: Document): Node | null {
  // Remove script, style, iframe, object, embed tags
  if (node.nodeType === NODE_TYPES.ELEMENT_NODE) {
    const element = node as Element;
    const tagName = element.tagName.toLowerCase();

    // allow svg tags and their children
    if (tagName == 'svg') {
      return node
    }

    // Remove disallowed tags
    if (!(tagName in ALLOWED_TAGS)) {
      node.parentNode?.removeChild(node);
      return null;
    }

    // Sanitize attributes
    sanitizeAttributes(element);

    // Process child nodes
    const children = Array.from(node.childNodes);
    for (const child of children) {
      sanitizeNode(child, doc);
    }
  }

  // Remove any comments
  if (node.nodeType === NODE_TYPES.COMMENT_NODE) {
    node.parentNode?.removeChild(node);
    return null;
  }

  return node;
}

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param {string} html - The HTML content to sanitize
 * @returns {Promise<string>} Sanitized HTML content
 */
export async function sanitize(html: string): Promise<string> {
  if (!html) return '';

  try {
    const doc = await createSafeDocument();
    const container = doc.createElement('div');
    container.innerHTML = html;

    // Process all nodes
    const nodes = Array.from(container.childNodes);
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (!sanitizeNode(node, doc)) {
        i--; // Adjust index if node was removed
      }
    }

    return container.innerHTML;
  } catch (error) {
    console.error('Error sanitizing HTML:', error);
    return ''; // Return empty string on error
  }
}
