"use client";

import DOMPurify from "dompurify";
import { useEffect, useState } from "react";

// Keep server and first client render identical; never emit unsanitized HTML.
export default function SafeHtml({ html }: { html?: string | null }) {
  const [content, setContent] = useState("");
  useEffect(() => {
    setContent(DOMPurify.sanitize(html ?? "", { USE_PROFILES: { html: true } }));
  }, [html]);
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
