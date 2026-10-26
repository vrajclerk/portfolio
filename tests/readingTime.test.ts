import assert from "node:assert/strict";
import test, { describe } from "node:test";
import {
  calculateReadingTime,
  extractTextFromLexical,
  formatReadingTime,
} from "../src/utilities/readingTime";

describe("readingTime utility", () => {
  test("returns 0 for empty or whitespace content", () => {
    assert.equal(calculateReadingTime(""), 0);
    assert.equal(calculateReadingTime("    "), 0);
    assert.equal(calculateReadingTime(null), 0);
    assert.equal(calculateReadingTime(undefined), 0);
  });

  test("calculates reading time for short text with minimum 1 min", () => {
    const text = "This is a short sample sentence with eight words.";
    assert.equal(calculateReadingTime(text), 1);
    assert.equal(formatReadingTime(1), "1 min read");
  });

  test("calculates reading time for 450 words as 3 minutes (at 200 wpm)", () => {
    const text = Array.from({ length: 450 }, () => "word").join(" ");
    assert.equal(calculateReadingTime(text), 3);
    assert.equal(formatReadingTime(3), "3 min read");
  });

  test("extracts text correctly from Lexical serialized node tree", () => {
    const lexicalContent = {
      root: {
        type: "root",
        format: "",
        indent: 0,
        version: 1,
        direction: "ltr" as const,
        children: [
          {
            type: "paragraph",
            children: [
              { type: "text", text: "Hello from " },
              { type: "text", text: "Lexical node!" },
            ],
          },
        ],
      },
    };

    const text = extractTextFromLexical(lexicalContent);
    assert.match(text, /Hello from\s+Lexical node!/);
    assert.equal(calculateReadingTime(lexicalContent), 1);
  });
});
