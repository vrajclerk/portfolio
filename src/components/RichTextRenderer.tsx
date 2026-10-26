import React from "react";
import { RichText } from "@payloadcms/richtext-lexical/react";

type RichTextData = React.ComponentProps<typeof RichText>["data"];

interface RichTextRendererProps {
  data?: RichTextData | null;
  className?: string;
}

export function RichTextRenderer({ data, className = "" }: RichTextRendererProps) {
  if (!data || typeof data !== "object" || !("root" in data) || !data.root) {
    return null;
  }

  return (
    <div
      className={`prose-content space-y-4 text-base leading-relaxed text-foreground/90 ${className}`}
    >
      <RichText data={data} />
    </div>
  );
}
