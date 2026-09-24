// Turns dist/preview/index.html (single file build) into the page fragment
// the claude.ai Artifact publisher expects: no doctype/html/head/body tags.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const dir = path.resolve(import.meta.dirname, "..", "dist", "preview");
const html = readFileSync(path.join(dir, "index.html"), "utf8");

// Take the inlined scripts out first: they contain HTML email templates
// whose own <title>/<style> tags must not be picked up below.
const scripts = [];
const rest = html.replace(/<script[^>]*>[\s\S]*?<\/script>/g, (m) => {
  scripts.push(m);
  return "";
});
const pick = (re) => [...rest.matchAll(re)].map((m) => m[0]);
const title = pick(/<title>[\s\S]*?<\/title>/g);
const fonts = pick(/<link[^>]+fonts\.googleapis\.com\/css2[^>]*>/g);
const styles = pick(/<style[^>]*>[\s\S]*?<\/style>/g);

const out = [
  ...title,
  ...fonts,
  ...styles,
  '<div id="root"></div>',
  ...scripts,
].join("\n");

writeFileSync(path.join(dir, "vac-workspace-beta.html"), out);
console.log(`wrote vac-workspace-beta.html (${(out.length / 1024).toFixed(0)} KB)`);
