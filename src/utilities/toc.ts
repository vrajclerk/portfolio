import { extractTextFromLexical } from "./readingTime";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface LexicalHeadingNode {
  type?: string;
  tag?: string;
  children?: unknown[];
  [key: string]: unknown;
}

interface LexicalRootNode {
  children?: unknown[];
  [key: string]: unknown;
}

/**
 * Traverses a Lexical document AST to extract h2 and h3 heading nodes.
 */
export function extractHeadingsFromLexical(content: unknown): TocItem[] {
  if (!content || typeof content !== "object") {
    return [];
  }

  const items: TocItem[] = [];
  const contentObj = content as Record<string, unknown>;
  const root = (
    contentObj.root && typeof contentObj.root === "object"
      ? (contentObj.root as LexicalRootNode)
      : (contentObj as LexicalRootNode)
  );

  if (!root || !Array.isArray(root.children)) {
    return items;
  }

  root.children.forEach((node: unknown, index: number) => {
    if (typeof node === "object" && node !== null) {
      const headingNode = node as LexicalHeadingNode;
      if (headingNode.type === "heading" && (headingNode.tag === "h2" || headingNode.tag === "h3")) {
        const text = extractTextFromLexical(headingNode).trim();
        if (text) {
          const level = headingNode.tag === "h2" ? 2 : 3;
          const id = slugifyHeading(text) || `section-${index}`;
          items.push({ id, text, level });
        }
      }
    }
  });

  return items;
}

