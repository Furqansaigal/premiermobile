// Launch smoke checks without sending real bookings or requiring a browser.
// Run after npm run build: node scripts/audit-check.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { build, transform } from 'esbuild';
process.on('uncaughtException', (error) => { console.error('AUDIT FAILED:', error.message); process.exit(1); });

const importCode = (code) => import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const html = fs.readFileSync('dist/index.html', 'utf8');
assert.match(html, /<title>Mobile Auto Detailing/);
assert.match(html, /name="viewport"/);
assert.match(html, /rel="canonical" href="https:\/\/premiermobiletexas.com\/"/);
assert.doesNotMatch(html, /noindex|localhost|127\.0\.0\.1|\/src\//);
for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
for (const match of html.matchAll(/(?:src|href)="(\/[^"#?]+)"/g)) {
  if (match[1] === '/card') continue; // SPA route, served through _redirects.
  assert.ok(fs.existsSync(path.join('dist', match[1])), `Missing built asset: ${match[1]}`);
}
for (const file of ['robots.txt', 'sitemap.xml', '_redirects', '_headers']) assert.ok(fs.existsSync(`dist/${file}`));
console.log('PASS: production HTML, metadata, structured data and entry assets');

const bundled = await build({
  stdin: { resolveDir: process.cwd(), loader: 'tsx', contents: `
    import React from 'react';
    import { renderToString } from 'react-dom/server.browser';
    import { MemoryRouter } from 'react-router-dom';
    import App from './src/App';
    import Card from './src/card/CardApp';
    import { ThemeProvider } from './src/context/ThemeContext';
    import { BookingModal } from './src/components/BookingModal';
    import { BookNowModal } from './src/card/components/BookNowModal';
    import { ServiceModal } from './src/card/components/ServiceModal';
    import { ReviewsModal } from './src/card/components/ReviewsModal';
    import { ContactActionSheet } from './src/card/components/ContactActionSheet';
    import { SaveContactModal } from './src/card/components/SaveContactModal';
    const noop = () => {};
    export const pages = Object.fromEntries(Object.entries({App, Card, BookingModal, BookNowModal, ServiceModal, ReviewsModal, ContactActionSheet, SaveContactModal}).map(([name, Component]) => [name,
      renderToString(<MemoryRouter><ThemeProvider><Component isOpen={true} onClose={noop} onSelectBookService={noop} /></ThemeProvider></MemoryRouter>)]));
  ` },
  bundle: true, write: false, format: 'esm', platform: 'browser',
  define: { 'process.env.NODE_ENV': '"production"', 'import.meta.env': '{}' },
  plugins: [{ name: 'asset-paths', setup(b) {
    b.onLoad({ filter: /\.(mp4|jpg|png)$/ }, (args) => ({
      contents: `export default ${JSON.stringify('/' + path.relative(process.cwd(), args.path).replaceAll('\\', '/'))}`,
      loader: 'js',
    }));
  } }],
});
const { pages } = await importCode(bundled.outputFiles[0].text);
for (const [name, markup] of Object.entries(pages)) {
  const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(ids.length, new Set(ids).size, `${name}: duplicate element IDs`);
  for (const control of markup.matchAll(/<(?:input|select|textarea)\b[^>]*>/g)) {
    const id = control[0].match(/\bid="([^"]+)"/)?.[1];
    assert.ok(/aria-label=|aria-labelledby=/.test(control[0]) || (id && markup.includes(`for="${id}"`)), `${name}: unlabelled control ${control[0]}`);
  }
  for (const image of markup.matchAll(/<img\b[^>]*>/g)) assert.match(image[0], /\balt=/, `${name}: missing image alt`);
  for (const match of markup.matchAll(/(?:src|poster)="(\/[^"?]+)"/g)) {
    const local = match[1].startsWith('/src/') ? match[1].slice(1) : path.join('public', match[1]);
    assert.ok(fs.existsSync(local), `${name}: missing media ${match[1]}`);
  }
  if (name.endsWith('Modal') || name === 'ContactActionSheet') {
    assert.match(markup, /role="dialog"/);
    assert.match(markup, /aria-modal="true"/);
  }
}
for (const match of pages.App.matchAll(/href="#([^"#]+)"/g)) assert.ok(pages.App.includes(`id="${match[1]}"`), `Broken anchor: ${match[1]}`);
assert.equal([...pages.App.matchAll(/<h1\b/g)].length, 1);
assert.equal([...pages.Card.matchAll(/<h1\b/g)].length, 1);
assert.match(pages.BookingModal, /<label for="bookingmodal-field-1"[^>]*>\s*FULL NAME \*/);
assert.match(pages.BookNowModal, /<label for="booknowmodal-field-1"[^>]*>Your Name/);
assert.equal([...pages.App.matchAll(/<video\b/g)].length, 3);
for (const video of pages.App.matchAll(/<video\b[^>]*>/g)) {
  assert.doesNotMatch(video[0], /\ssrc=/, 'Video source must not load at initial render');
  assert.match(video[0], /preload="none"/);
  assert.match(video[0], /poster=/);
}
console.log('PASS: both pages and all six dialogs render; labelled fields, media, anchors, headings and deferred videos');

const savedFetch = globalThis.fetch;
const savedWindow = globalThis.window;
const savedError = console.error;
globalThis.window = { setTimeout, clearTimeout };
console.error = () => {};
try {
  const source = fs.readFileSync('src/lib/web3forms.ts', 'utf8');
  let variant = 0;
  const makeSender = async (env = {}) => {
    const compiled = await transform(source + `\n// case ${variant++}`, { loader: 'ts', format: 'esm', define: { 'import.meta.env': JSON.stringify(env) } });
    return (await importCode(compiled.code)).sendWeb3FormsNotification;
  };
  const send = await makeSender();
  let calls = [];
  const payload = { name: 'LOCAL AUDIT ONLY', phone: '0000000000', vehicleMakeModel: 'Test vehicle', packageId: 'prestige' };
  globalThis.fetch = async (_url, options) => { calls.push(JSON.parse(options.body)); return { ok: true, json: async () => ({ success: true }) }; };
  assert.equal(await send(payload), true);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].vehicleMakeModel, payload.vehicleMakeModel);
  globalThis.fetch = async () => ({ ok: false, json: async () => ({ success: true }) });
  assert.equal(await send(payload), false, 'HTTP failures cannot report success');
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ success: false }) });
  assert.equal(await send(payload), false);
  globalThis.fetch = async () => { throw new TypeError('Simulated offline'); };
  assert.equal(await send(payload), false);
  globalThis.fetch = async () => ({ ok: true, json: async () => { throw new SyntaxError('Invalid response'); } });
  assert.equal(await send(payload), false);
  const unconfigured = await makeSender({ VITE_WEB3FORMS_ACCESS_KEY: 'YOUR_WEB3FORMS_ACCESS_KEY', VITE_WEB3FORMS_CLIENT_ACCESS_KEY: 'YOUR_CLIENT_WEB3FORMS_ACCESS_KEY' });
  assert.equal(await unconfigured(payload), false);
  calls = [];
  globalThis.fetch = async (_url, options) => { calls.push(options); return { ok: true, json: async () => ({ success: true }) }; };
  const deduplicated = await makeSender({ VITE_WEB3FORMS_ACCESS_KEY: 'same-test-key', VITE_WEB3FORMS_CLIENT_ACCESS_KEY: 'same-test-key' });
  assert.equal(await deduplicated(payload), true);
  assert.equal(calls.length, 1);
  globalThis.window.setTimeout = (callback) => setTimeout(callback, 5);
  globalThis.fetch = async (_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new Error('Timed out'))));
  assert.equal(await send(payload), false);
  console.log('PASS: mocked form success, HTTP rejection, API rejection, offline, invalid JSON, missing config, duplicate recipients and timeout');
} finally {
  globalThis.fetch = savedFetch;
  globalThis.window = savedWindow;
  console.error = savedError;
}

let originalBytes = 0, mobileBytes = 0;
for (let i = 1; i <= 7; i++) {
  originalBytes += fs.statSync(`src/assets/videos/showcase-${i}.mp4`).size;
  const buffer = fs.readFileSync(`src/assets/videos/optimized/showcase-${i}-mobile.mp4`);
  mobileBytes += buffer.length;
  let offset = 0; const atoms = [];
  while (offset + 8 <= buffer.length) {
    const size = buffer.readUInt32BE(offset);
    atoms.push(buffer.toString('ascii', offset + 4, offset + 8));
    if (size < 8) break;
    offset += size;
  }
  assert.ok(atoms.indexOf('moov') >= 0 && atoms.indexOf('moov') < atoms.indexOf('mdat'), `showcase-${i}: not fast-start`);
}
console.log(`PASS: all 7 mobile MP4s are fast-start; ${(originalBytes / 1e6).toFixed(2)} MB → ${(mobileBytes / 1e6).toFixed(2)} MB (${((1 - mobileBytes / originalBytes) * 100).toFixed(1)}% smaller)`);

// Exercise the actual video lifecycle against controllable media/observer doubles.
const videoModule = await build({
  entryPoints: ['src/components/LazyVideo.tsx'], bundle: true, write: false, format: 'esm', jsx: 'transform',
  plugins: [{ name: 'hook-doubles', setup(b) {
    b.onResolve({ filter: /^(react(?:\/jsx-runtime)?|lucide-react)$/ }, ({ path }) => ({ path, namespace: 'doubles' }));
    b.onLoad({ filter: /.*/, namespace: 'doubles' }, ({ path }) => ({ contents: path === 'react'
      ? 'export const useRef=(v)=>globalThis.auditHooks.useRef(v); export const useState=(v)=>[v,()=>{}]; export const useEffect=(cb)=>globalThis.auditHooks.effects.push(cb); export default {createElement:(type,props,...children)=>({type,props,children}),Fragment:"fragment"};'
      : path === 'react/jsx-runtime' ? 'export const jsx=(type,props)=>({type,props,children:props.children}), jsxs=jsx, Fragment="fragment";'
      : 'export const Play="play-icon", Pause="pause-icon";', loader: 'js' }));
  } }],
});
const { LazyVideo } = await importCode(videoModule.outputFiles[0].text);
const descriptors = Object.fromEntries(['window', 'document', 'navigator', 'IntersectionObserver', 'auditHooks'].map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
try {
  for (const mode of ['mobile', 'desktop', 'reduced-motion', 'save-data']) {
    const observers = [], effects = [], timers = [], listeners = {};
    const video = { src: '', paused: true, plays: 0, loads: 0,
      getAttribute() { return this.src || null; }, removeAttribute() { this.src = ''; },
      load() { this.loads++; }, pause() { this.paused = true; }, play() { this.paused = false; this.plays++; return Promise.resolve(); },
    };
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { connection: { saveData: mode === 'save-data' } } });
    globalThis.window = { matchMedia: (query) => ({ matches: query.includes('reduced-motion') ? mode === 'reduced-motion' : mode !== 'desktop', addEventListener() {}, removeEventListener() {} }), setTimeout(cb) { timers.push(cb); return timers.length; }, clearTimeout() {} };
    globalThis.document = { hidden: false, addEventListener(name, cb) { listeners[name] = cb; }, removeEventListener() {} };
    globalThis.IntersectionObserver = class { constructor(cb) { this.cb = cb; observers.push(this); } observe() {} disconnect() {} trigger(visible) { this.cb([{ isIntersecting: visible }]); } };
    globalThis.auditHooks = { effects, useRef: (value) => ({ current: value === null ? video : value }) };
    const tree = LazyVideo({ src: '/desktop.mp4', mobileSrc: '/mobile.mp4', poster: '/poster.jpg', priority: true });
    const cleanup = effects[0]();
    assert.equal(video.src, '', `${mode}: no source before approaching viewport`);
    observers[0].trigger(true);
    observers[1].trigger(true);
    assert.equal(video.src, '', `${mode}: hero respects its initial delay`);
    timers[0]();
    if (mode === 'reduced-motion' || mode === 'save-data') {
      assert.equal(video.src, '', `${mode}: no automatic video download`);
      tree.children[1].props.onClick();
      assert.equal(video.paused, false, `${mode}: explicit play still works`);
    } else {
      assert.equal(video.src, mode === 'mobile' ? '/mobile.mp4' : '/desktop.mp4');
      assert.equal(video.paused, false);
      observers[1].trigger(false);
      assert.equal(video.paused, true, 'Offscreen media pauses');
      observers[1].trigger(true);
      globalThis.document.hidden = true;
      listeners.visibilitychange();
      assert.equal(video.paused, true, 'Hidden-tab media pauses');
    }
    cleanup();
    assert.equal(video.src, '', 'Unmount releases the video source');
  }
  console.log('PASS: video source selection, delayed loading, visibility pause, reduced motion, data saver, manual play and cleanup');
} finally {
  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else delete globalThis[key];
  }
}
console.log('NOTE: these are static/render and mocked transport checks, not browser layout, autoplay, real inbox delivery or Core Web Vitals measurements.');
// React's browser SSR scheduler leaves a MessagePort open in Node after completion.
process.exit(0);
