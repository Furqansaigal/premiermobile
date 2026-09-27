// Component-level regression checks; no browser or real network requests.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';

process.on('uncaughtException', (error) => { console.error(error.message); process.exit(1); });
const compiled = await build({
  entryPoints: ['src/components/VideoReels.tsx'], bundle: true, write: false, format: 'esm',
  plugins: [{ name: 'component-doubles', setup(b) {
    b.onResolve({ filter: /^(react(?:\/jsx-runtime)?|motion\/react|lucide-react)$|\/LazyVideo$/ }, ({ path }) => ({ path, namespace: 'doubles' }));
    b.onLoad({ filter: /.*/, namespace: 'doubles' }, ({ path: name }) => ({ loader: 'js', contents:
      name === 'react' ? 'export const useState=(value)=>globalThis.reelHooks.useState(value); export default {};'
      : name === 'react/jsx-runtime' ? 'export const jsx=(type,props,key)=>({type,props,key}), jsxs=jsx;'
      : name === 'motion/react' ? 'export const motion={div:"motion.div"};'
      : name.endsWith('/LazyVideo') ? 'export const LazyVideo="lazy-video";'
      : 'export const ArrowLeft="left", ArrowRight="right", Calendar="calendar", MapPin="pin", Sparkles="sparkles", Volume2="volume", VolumeX="mute";',
    }));
    b.onLoad({ filter: /\.(mp4|jpg)$/ }, ({ path: file }) => ({ loader: 'js', contents: `export default ${JSON.stringify(file)}` }));
  } }],
});
const { VideoReels } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
let cursor = 0;
const values = [];
globalThis.reelHooks = { useState(initial) {
  const index = cursor++;
  if (!(index in values)) values[index] = initial;
  return [values[index], (update) => { values[index] = typeof update === 'function' ? update(values[index]) : update; }];
} };
const flatten = (node) => {
  if (Array.isArray(node)) return node.flatMap(flatten);
  if (!node || typeof node !== 'object') return [];
  return [node, ...flatten(node.props?.children)];
};
const render = () => { cursor = 0; return flatten(VideoReels({ onOpenBooking() {} })); };
const button = (nodes, label) => nodes.find((node) => node.type === 'button' && node.props['aria-label'] === label);
const clipNumber = (file) => Number(path.basename(file).match(/showcase-(\d+)/)[1]);
const assertSelection = (nodes, expected) => {
  const video = nodes.find((node) => node.type === 'lazy-video');
  const previews = nodes.filter((node) => node.type === 'img');
  const actual = [clipNumber(previews[0].props.src), clipNumber(video.props.src), clipNumber(previews[1].props.src)];
  assert.deepEqual(actual, [(expected + 5) % 7 + 1, expected, expected % 7 + 1]);
  assert.equal(new Set(actual).size, 3, 'Three visible selections must be distinct');
  assert.equal(clipNumber(video.props.poster), expected);
  assert.equal(clipNumber(video.props.mobileSrc), expected);
  assert.equal(video.props.showPlaybackControl, false);
  assert.equal(video.props.preloadWhenNear, 'auto');
  assert.ok(video.props.src.endsWith('-desktop.mp4'));
  assert.equal(video.key, `showcase-${expected}`);
  assert.ok(previews.every((node) => node.key === `showcase-${clipNumber(node.props.src)}`));
  assert.ok(nodes.filter((node) => node.type === 'motion.div').every((node) => !node.props.exit), 'No outgoing center may linger behind updated side previews');
};
let nodes = render();
let expected = 5;
assertSelection(nodes, expected);
for (const direction of [1, 1, 1, -1, -1, -1, -1, -1, -1, -1, 1, 1, 1]) {
  button(nodes, direction === 1 ? 'Show next video' : 'Show previous video').props.onClick();
  expected = ((expected - 1 + direction + 7) % 7) + 1;
  nodes = render();
  assertSelection(nodes, expected);
}
// Multiple clicks before React commits must all advance, using functional updates.
const rapidNext = button(nodes, 'Show next video').props.onClick;
for (let i = 0; i < 25; i++) rapidNext();
expected = ((expected - 1 + 25) % 7) + 1;
nodes = render();
assertSelection(nodes, expected);
button(nodes, 'Unmute active video').props.onClick();
nodes = render();
assert.equal(nodes.find((node) => node.type === 'lazy-video').props.muted, false);
button(nodes, 'Show next video').props.onClick();
nodes = render();
assert.equal(nodes.find((node) => node.type === 'lazy-video').props.muted, true, 'New clips must start muted for autoplay');
assertSelection(nodes, expected % 7 + 1);
delete globalThis.reelHooks;

let originals = 0, optimized = 0;
for (let i = 1; i <= 7; i++) {
  originals += fs.statSync(`src/assets/videos/showcase-${i}.mp4`).size;
  const file = fs.readFileSync(`src/assets/videos/optimized/showcase-${i}-desktop.mp4`);
  optimized += file.length;
  let offset = 0; const atoms = [];
  while (offset + 8 <= file.length) {
    const size = file.readUInt32BE(offset);
    atoms.push(file.toString('ascii', offset + 4, offset + 8));
    if (size < 8) break;
    offset += size;
  }
  assert.ok(atoms.indexOf('moov') >= 0 && atoms.indexOf('moov') < atoms.indexOf('mdat'));
  assert.ok(file.length < fs.statSync(`src/assets/videos/showcase-${i}.mp4`).size, `Clip ${i} should not grow`);
}
console.log('PASS: distinct/synchronized previews, next/previous wraparound, 25 rapid clicks, correct poster/source pairing, muted autoplay reset, no pause control and no exit-delay mismatch.');
console.log(`PASS: all desktop clips are fast-start; ${(originals / 1e6).toFixed(2)} MB → ${(optimized / 1e6).toFixed(2)} MB (${((1 - optimized / originals) * 100).toFixed(1)}% smaller).`);
console.log('These checks do not measure browser playback frame rate or actual network startup time.');
