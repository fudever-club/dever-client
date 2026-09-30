const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Load the pure readiness util with no live I/O (same harness as client-regressions).
function loadSource(relativePath) {
  const filename = path.join(__dirname, '..', relativePath);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, {
    exports, require, URL, URLSearchParams, setTimeout, clearTimeout,
    console: { warn() {} },
  }, { filename });
  return exports;
}

const readiness = loadSource('src/utils/blogReadiness.ts');
const { evaluateBlogReadiness, countSubmissionWords, TITLE_MIN_LENGTH, CONTENT_MIN_WORDS } = readiness;

const readyInput = () => ({
  title: 'Toi uu truy van MongoDB voi Compound Index',
  content: Array(310).fill('tu').join(' '),
  category: 'Backend & Distributed Systems',
  tags: ['MongoDB'],
});

test('thresholds match the submit checklist spec', () => {
  assert.equal(TITLE_MIN_LENGTH, 10);
  assert.equal(CONTENT_MIN_WORDS, 300);
});

test('a complete draft passes all four checklist items', () => {
  const result = evaluateBlogReadiness(readyInput());
  assert.equal(result.items.length, 4);
  // join() avoids cross-realm Array prototype mismatch under assert/strict.
  assert.equal(result.items.map((i) => i.id).join(','), 'title,content,category,tags');
  assert.equal(result.isReady, true);
});

test('short title blocks readiness while other items pass', () => {
  const result = evaluateBlogReadiness({ ...readyInput(), title: 'Ngan qua' });
  assert.equal(result.items.find((i) => i.id === 'title').met, false);
  assert.equal(result.isReady, false);
});

test('content gate counts stripped markdown words, not syntax', () => {
  const body = [
    '# Tieu de bai viet', // -> 4 words
    Array(288).fill('tu').join(' '), // 288 words
    '- muc mot', // -> 2 words
    '> trich dan hay', // -> 3 words
    '[nhan doc](https://example.com/bai-viet)', // -> 2 words
    '![minh hoa](https://example.com/anh.png)', // -> 2 words
    '`inline-code`', // -> 1 word
  ].join('\n\n');
  const stripped = countSubmissionWords(body);
  assert.equal(stripped, 4 + 288 + 2 + 3 + 2 + 2 + 1);
  const naive = body.trim().split(/\s+/).length;
  assert.ok(naive > stripped, `naive=${naive} stripped=${stripped}`);
  assert.equal(evaluateBlogReadiness({ ...readyInput(), content: body }).isReady, true);
});

test('content below 300 stripped words blocks readiness', () => {
  const short = Array(299).fill('tu').join(' ');
  assert.equal(countSubmissionWords(short), 299);
  assert.equal(evaluateBlogReadiness({ ...readyInput(), content: short }).isReady, false);
  const exact = Array(300).fill('tu').join(' ');
  assert.equal(countSubmissionWords(exact), 300);
  assert.equal(evaluateBlogReadiness({ ...readyInput(), content: exact }).isReady, true);
});

test('fenced code and mermaid blocks do not count as article words', () => {
  const content = `${Array(10).fill('tu').join(' ')}\n\n\`\`\`typescript\n${Array(500).fill('code').join(' ')}\n\`\`\`\n\n\`\`\`mermaid\ngraph TD\nA-->B\n\`\`\`\n`;
  assert.equal(countSubmissionWords(content), 10);
  assert.equal(evaluateBlogReadiness({ ...readyInput(), content }).isReady, false);
});

test('missing category or tags each block readiness', () => {
  assert.equal(evaluateBlogReadiness({ ...readyInput(), category: '   ' }).isReady, false);
  assert.equal(evaluateBlogReadiness({ ...readyInput(), tags: [] }).isReady, false);
});

test('draft autosave payload fields stay untouched by the checklist', () => {
  // Checklist is UI-only: evaluate() must not mutate its input.
  const input = readyInput();
  const snapshot = JSON.stringify(input);
  evaluateBlogReadiness(input);
  assert.equal(JSON.stringify(input), snapshot);
});
