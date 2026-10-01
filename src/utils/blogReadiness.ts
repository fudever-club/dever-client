// "Sẵn sàng gửi duyệt" readiness rules for CreateBlog.
// Pure helpers (no React/API/storage) so they stay unit-testable.
// UI labels/hints live in the blogChecklist i18n namespace; thresholds here stay numeric.

export const TITLE_MIN_LENGTH = 10;
export const CONTENT_MIN_WORDS = 300;

export interface BlogReadinessInput {
  title: string;
  content: string;
  category: string;
  tags: string[];
}

export interface BlogReadinessItem {
  id: "title" | "content" | "category" | "tags";
  met: boolean;
}

export interface BlogReadiness {
  items: BlogReadinessItem[];
  isReady: boolean;
  titleLength: number;
  wordCount: number;
  tagCount: number;
}

// NOTE: cover image is intentionally NOT a blocking item. handleSaveOrPublish
// already falls back to a default DEVER SVG cover, so a missing upload must
// not block "Gửi duyệt".
export function stripMarkdownForWordCount(markdown: string): string {
  let text = markdown;
  // Fenced blocks (code + mermaid diagrams): prose gate counts article text,
  // not code/diagram payloads.
  text = text.replace(/```[\s\S]*?(```|$)/g, " ");
  // Images: keep alt text, drop URL. Links: keep label, drop URL.
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1");
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  // Raw HTML tags.
  text = text.replace(/<[^>]*>/g, " ");
  // Block markers: headings, blockquotes, list bullets/numbers.
  text = text.replace(/^#{1,6}\s+/gm, "");
  text = text.replace(/^\s*>\s?/gm, "");
  text = text.replace(/^\s*(?:[-*+]|\d+[.)])\s+/gm, "");
  // Table pipes and callout tags ([!NOTE], [!TIP], ...).
  text = text.replace(/\|/g, " ");
  text = text.replace(/\[!(?:NOTE|TIP|WARNING|CAUTION)\]/gi, " ");
  // Emphasis/strikethrough markers and leftover backticks.
  text = text.replace(/(\*\*|__|\*|_|~~|`)/g, "");
  // Bare URLs never count as words.
  text = text.replace(/https?:\/\/\S+/g, " ");
  return text;
}

export function countSubmissionWords(markdown: string): number {
  const plain = stripMarkdownForWordCount(markdown);
  const tokens = plain.trim().split(/\s+/).filter(Boolean);
  // Drop pure-punctuation leftovers (e.g. table ":---" cells).
  return tokens.filter((token) => /[\p{L}\p{N}]/u.test(token)).length;
}

export function evaluateBlogReadiness(input: BlogReadinessInput): BlogReadiness {
  const titleLength = input.title.trim().length;
  const wordCount = countSubmissionWords(input.content);
  const tagCount = input.tags.length;
  const items: BlogReadinessItem[] = [
    { id: "title", met: titleLength >= TITLE_MIN_LENGTH },
    { id: "content", met: wordCount >= CONTENT_MIN_WORDS },
    { id: "category", met: input.category.trim().length > 0 },
    { id: "tags", met: tagCount >= 1 },
  ];
  return {
    items,
    isReady: items.every((item) => item.met),
    titleLength,
    wordCount,
    tagCount,
  };
}
