const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Run the actual utility sources with isolated browser/API boundaries; no live I/O.
function loadSource(relativePath, imports = {}, globals = {}) {
  const filename = path.join(__dirname, '..', relativePath);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, {
    exports, require: (name) => name in imports ? imports[name] : require(name),
    URL, URLSearchParams, Headers, AbortController, setTimeout, clearTimeout,
    console: { warn() {} }, ...globals,
  }, { filename });
  return exports;
}

const constants = {
  API_SERVER: 'http://localhost:5000', ACCESS_TOKEN: '_access_token',
  REFRESH_TOKEN: '_refresh_token', USER_INFO: '_user_info', AVT: '_avt',
  MAIL: '_credential', FN: '_fname', LN: '_lname', IS_AUTH: '_is_auth',
  NICK_NANE: '_nname', SUB_ACCOUNT_ID: '_sub_account_id', SUB_ACCOUNT_INFO: '_sub_account_info',
};

test('sign-out removes session data while preserving drafts and language preferences', () => {
  const cookies = new Map([['_access_token', 'synthetic'], ['i18next', 'en']]);
  const storage = new Map([['_access_token', 'synthetic'], ['dever_blog_draft', 'unsent draft']]);
  const client = loadSource('src/utils/webStorageClient.ts', {
    '@/settings': { constants },
    'cookies-next': { deleteCookie: key => cookies.delete(key) },
    'js-cookie': { get: () => Object.fromEntries(cookies), remove: key => cookies.delete(key) },
  }, { window: {}, localStorage: { clear: () => storage.clear(), removeItem: key => storage.delete(key) } }).default;
  client.removeAll();
  assert.equal(cookies.has('_access_token'), false);
  assert.equal(storage.has('_access_token'), false);
  assert.equal(cookies.get('i18next'), 'en');
  assert.equal(storage.get('dever_blog_draft'), 'unsent draft');
});

test('cookie persistence options are not overwritten by a second session cookie write', () => {
  const writes = [];
  const client = loadSource('src/utils/webStorageClient.ts', {
    '@/settings': { constants },
    'cookies-next': { setCookie: (...args) => writes.push(args) },
    'js-cookie': { set: (...args) => writes.push(args) },
  }).default;
  client.setToken('synthetic');
  assert.equal(writes.length, 1);
  assert.equal(writes[0][2].maxAge, 30 * 24 * 60 * 60);
});

function apiWith(fetch, storage = { getToken: () => null, removeAll() {} }, session = null) {
  return loadSource('src/utils/apiClient.ts', {
    '@/settings': { constants }, './webStorageClient': storage,
    './sessionRefresh': session || { isAuthEndpoint: () => false, refreshSession: async () => false },
  }, { fetch }).apiFetch;
}

test('API requests propagate caller cancellation and detach abort listeners', async () => {
  const caller = new AbortController();
  let signal;
  const apiFetch = apiWith(async (_url, options) => {
    signal = options.signal;
    caller.abort();
    return new Response('{}', { headers: { 'content-type': 'application/json' } });
  });
  await apiFetch('/api/v1/fund', { signal: caller.signal });
  assert.equal(signal.aborted, true);
});

test('an unauthenticated request returning 401 does not destroy the signed-in session', async () => {
  let cleared = false;
  const apiFetch = apiWith(async () => new Response('{}', { status: 401 }), {
    getToken: () => 'synthetic', removeAll: () => { cleared = true; },
  });
  await apiFetch('/public', { skipAuth: true });
  assert.equal(cleared, false);
});

test('API timeout covers response body consumption as well as response headers', async () => {
  const apiFetch = apiWith(async (_url, { signal }) => ({
    status: 200, ok: true, headers: new Headers({ 'content-type': 'application/json' }),
    json: () => new Promise((resolve, reject) => {
      const fallback = setTimeout(() => resolve({}), 50);
      signal.addEventListener('abort', () => {
        clearTimeout(fallback);
        reject(new DOMException('Aborted', 'AbortError'));
      }, { once: true });
    }),
  }));
  const result = await apiFetch('/slow-body', { timeoutMs: 5 });
  assert.equal(result.ok, false);
  assert.equal(result.status, 408);
});

test('an authenticated 401 triggers one silent refresh before sign-out', async () => {
  let cleared = false;
  let refreshCalls = 0;
  let calls = 0;
  const apiFetch = apiWith(async () => {
    calls += 1;
    if (calls === 1) return new Response('{}', { status: 401 });
    return new Response('{"ok":true}', { headers: { 'content-type': 'application/json' } });
  }, {
    getToken: () => 'synthetic', removeAll: () => { cleared = true; },
  }, {
    isAuthEndpoint: () => false,
    refreshSession: async () => { refreshCalls += 1; return true; },
  });
  const result = await apiFetch('/api/v1/fund');
  assert.equal(result.ok, true);
  assert.equal(refreshCalls, 1);
  assert.equal(cleared, false);
});

test('member filters reset pagination and preserve other filters', () => {
  const { createQueryString } = loadSource('src/utils/queryString.ts', {}, {
    window: { location: { search: '?page=5&majorId=engineering' } },
  });
  const params = new URLSearchParams(createQueryString('search', 'Ada', true));
  assert.equal(params.get('page'), null);
  assert.equal(params.get('majorId'), 'engineering');
  assert.equal(params.get('search'), 'Ada');
});

test('client rewrites honor the configured backend and retain the production fallback', async () => {
  const { pathToFileURL } = require('node:url');
  const configUrl = pathToFileURL(path.join(__dirname, '..', 'next.config.mjs'));
  const original = process.env.NEXT_PUBLIC_API_SERVER;
  try {
    process.env.NEXT_PUBLIC_API_SERVER = 'http://localhost:5000/';
    const configured = (await import(`${configUrl}?configured`)).default;
    const rules = await configured.rewrites();
    assert.equal(rules[0].destination, 'http://localhost:5000/api/v1/:path*');
    assert.equal(rules[1].destination, 'http://localhost:5000/static/:path*');
    delete process.env.NEXT_PUBLIC_API_SERVER;
    const fallback = (await import(`${configUrl}?fallback`)).default;
    assert.equal((await fallback.rewrites())[0].destination, 'https://dever-backend-production.up.railway.app/api/v1/:path*');
  } finally {
    if (original === undefined) delete process.env.NEXT_PUBLIC_API_SERVER;
    else process.env.NEXT_PUBLIC_API_SERVER = original;
  }
});
