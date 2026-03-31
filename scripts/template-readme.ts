/**
 * Generates README.md from README_test.ts.
 *
 * Convention in README_test.ts:
 *   - `// ` prefixed lines become markdown prose (prefix stripped)
 *   - `//` alone becomes a blank line
 *   - Lines between `// \`\`\`lang` and `// \`\`\`` markers form fenced code blocks
 *   - Real TypeScript (non-comment) lines inside a fence are code
 *   - Comment lines (`// ...`) inside a fence are also code (prefix stripped)
 *   - `import ... from "./src/index.ts"` is rewritten to `"json-schema-translator"`
 *   - `import ... from "@std/assert"` lines are stripped entirely
 *   - `Deno.test(...)` blocks are stripped entirely
 *
 * Run: deno task readme
 */

const source = await Deno.readTextFile("README_test.ts");
const lines = source.split("\n");
const output: string[] = [];

let inFence = false;
let inTestBlock = false;
let testBraceDepth = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Skip test-only imports (always top-level, never in fences)
  if (
    !inFence &&
    line.startsWith("import") &&
    (line.includes("@std/assert") || line.includes("@std/assert/"))
  ) {
    continue;
  }

  // Track and skip Deno.test blocks
  if (!inTestBlock && line.trimStart().startsWith("Deno.test(")) {
    inTestBlock = true;
    testBraceDepth = 0;
    for (const ch of line) {
      if (ch === "{") testBraceDepth++;
      if (ch === "}") testBraceDepth--;
    }
    if (testBraceDepth <= 0) inTestBlock = false;
    continue;
  }

  if (inTestBlock) {
    for (const ch of line) {
      if (ch === "{") testBraceDepth++;
      if (ch === "}") testBraceDepth--;
    }
    if (testBraceDepth <= 0) inTestBlock = false;
    continue;
  }

  // Check for fence open/close markers
  const fenceOpenMatch = line.match(/^\/\/ ```(\w*)$/);
  const fenceCloseMatch = !fenceOpenMatch && line === "// ```";

  if (fenceOpenMatch && !inFence) {
    inFence = true;
    const lang = fenceOpenMatch[1];
    output.push("```" + lang);
    continue;
  }

  if (fenceCloseMatch && inFence) {
    inFence = false;
    output.push("```");
    continue;
  }

  if (inFence) {
    // Inside a fence: comment lines have their prefix stripped,
    // real code lines are kept as-is (with import path rewriting)
    if (line === "//") {
      output.push("");
    } else if (line.startsWith("// ")) {
      output.push(line.slice(3));
    } else {
      const rewritten = line.replace(
        /from ["']\.\/src\/index\.ts["']/g,
        'from "json-schema-translator"',
      );
      output.push(rewritten);
    }
    continue;
  }

  // Outside fence: comment lines are markdown prose
  if (line === "//") {
    output.push("");
    continue;
  }

  if (line.startsWith("// ")) {
    output.push(line.slice(3));
    continue;
  }

  // Blank lines between sections
  if (line.trim() === "") {
    output.push("");
    continue;
  }

  // Real code outside a fence that isn't a test — skip
  // (these are imports/variables needed for the test but not shown in the README)
}

// Trim leading and trailing blank lines
while (output.length && output[0] === "") {
  output.shift();
}
while (output.length && output[output.length - 1] === "") {
  output.pop();
}

// Collapse 3+ consecutive blank lines to 2
const collapsed: string[] = [];
let consecutiveBlanks = 0;
for (const line of output) {
  if (line === "") {
    consecutiveBlanks++;
    if (consecutiveBlanks <= 2) {
      collapsed.push(line);
    }
  } else {
    consecutiveBlanks = 0;
    collapsed.push(line);
  }
}

const readme = collapsed.join("\n") + "\n";
await Deno.writeTextFile("README.md", readme);

console.log(`Generated README.md (${readme.length} bytes)`);
