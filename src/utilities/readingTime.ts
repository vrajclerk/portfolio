/**
 * Reading time calculation utility.
 *
 * Estimates reading time based on an average reading speed of 200 words per minute.
 * Supports plain string inputs or Lexical serialized node trees.
 */

interface LexicalNode {
  text?: string;
  children?: LexicalNode[];
  [key: string]: unknown;
}

/**
 * Recursively extracts plain text from a Lexical editor state or node.
 */
export function extractTextFromLexical(node: unknown): string {
  if (!node || typeof node !== "object") {
    return "";
  }

  const lexicalNode = node as LexicalNode;
  let text = "";

  if (typeof lexicalNode.text === "string") {
    text += lexicalNode.text + " ";
  }

  if (Array.isArray(lexicalNode.children)) {
    for (const child of lexicalNode.children) {
      text += extractTextFromLexical(child);
    }
  }

  // Handle root container if passed directly
  if ("root" in lexicalNode && lexicalNode.root) {
    text += extractTextFromLexical(lexicalNode.root);
  }

  return text;
}

/**
 * Calculates reading time in whole minutes from text or Lexical state.
 * Returns minimum 1 minute for any non-empty content.
 */
export function calculateReadingTime(content: unknown, wordsPerMinute = 200): number {
  let text = "";

  if (typeof content === "string") {
    text = content;
  } else if (content && typeof content === "object") {
    text = extractTextFromLexical(content);
  }

  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  if (words.length === 0) {
    return 0;
  }

  const minutes = Math.ceil(words.length / wordsPerMinute);
  return Math.max(1, minutes);
}

/**
 * Formats reading time into a human-readable string (e.g. "3 min read").
 */
export function formatReadingTime(minutes: number): string {
  if (minutes <= 0) {
    return "Quick read";
  }
  return `${minutes} min read`;
}
