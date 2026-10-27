import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, expect, it } from 'vitest';

// The library stylesheet is loaded by host pages next to their own CSS, so every
// rule must be scoped to the component root. An unscoped `:root` or `*` rule
// restyles the host page (enjoeneer.dev lost its Inter font to one in 1.3.0).
const ROOT = '.astar-visualizer-root';

/** Top-level and @media-nested selectors of a stylesheet, ignoring @keyframes steps */
function selectors(css: string): string[] {
  const out: string[] = [];
  const stack: string[] = [];
  let buf = '';
  for (const ch of css.replace(/\/\*[\s\S]*?\*\//g, '')) {
    if (ch === '{') {
      const sel = buf.trim();
      const inKeyframes = stack.some(s => s.startsWith('@keyframes'));
      if (!sel.startsWith('@') && !inKeyframes) out.push(sel);
      stack.push(sel);
      buf = '';
    } else if (ch === '}') {
      stack.pop();
      buf = '';
    } else {
      buf += ch;
    }
  }
  return out;
}

describe('library stylesheet scoping', () => {
  for (const file of ['index.css', 'App.css']) {
    it(`${file} scopes every rule to ${ROOT}`, () => {
      const css = readFileSync(resolve(__dirname, file), 'utf8');
      const unscoped = selectors(css).filter(sel =>
        sel.split(',').some(part => !part.trim().startsWith(ROOT))
      );
      expect(unscoped).toEqual([]);
    });
  }
});
