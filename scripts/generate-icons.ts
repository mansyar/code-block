/**
 * Draws the app icons once and writes them as real PNGs (plan D8).
 *
 * Run `bun run icons` after changing the art. The PNGs are committed, and verification only checks
 * that they exist and are listed in the manifest — never that they were regenerated — so this
 * script is a build tool, not part of `bun run verify`.
 *
 * The art is the app's own palette: a sun field with a grid of ink blocks, six of them, which is
 * the "code block" the child is stacking.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { deflateSync } from 'node:zlib';

type Rgb = readonly [number, number, number];

const SUN: Rgb = [0xf6, 0xc4, 0x45];
const INK: Rgb = [0x1c, 0x21, 0x30];

/** Everything is a fraction of the icon edge, so both sizes are the same drawing. */
const INSET = 0.17;
const GAP = 0.055;
const CORNER = 0.1;
const SAMPLES = 4;

const COLUMNS = 3;
const ROWS = 2;

const iconDir = new URL('../public/icons/', import.meta.url);

function insideRoundedRect(
  u: number,
  v: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  radius: number,
): boolean {
  if (u < x0 || u > x1 || v < y0 || v > y1) {
    return false;
  }

  const nearestU = Math.min(Math.max(u, x0 + radius), x1 - radius);
  const nearestV = Math.min(Math.max(v, y0 + radius), y1 - radius);
  const du = u - nearestU;
  const dv = v - nearestV;

  return du * du + dv * dv <= radius * radius;
}

function isBlock(u: number, v: number): boolean {
  const usable = 1 - 2 * INSET;
  const cellWidth = (usable - (COLUMNS - 1) * GAP) / COLUMNS;
  const cellHeight = (usable - (ROWS - 1) * GAP) / ROWS;
  const radius = Math.min(cellWidth, cellHeight) * CORNER;

  for (let column = 0; column < COLUMNS; column += 1) {
    for (let row = 0; row < ROWS; row += 1) {
      const x0 = INSET + column * (cellWidth + GAP);
      const y0 = INSET + row * (cellHeight + GAP);

      if (insideRoundedRect(u, v, x0, y0, x0 + cellWidth, y0 + cellHeight, radius)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Share of one pixel covered by ink, sampled on a grid inside that single pixel so the corners are
 * not stair-stepped. `step` is one pixel expressed as a fraction of the icon edge.
 */
function coverage(u: number, v: number, step: number): number {
  let hits = 0;

  for (let sx = 0; sx < SAMPLES; sx += 1) {
    for (let sy = 0; sy < SAMPLES; sy += 1) {
      if (isBlock(u + (sx + 0.5) * step, v + (sy + 0.5) * step)) {
        hits += 1;
      }
    }
  }

  return hits / (SAMPLES * SAMPLES);
}

function blend(ink: number): Rgb {
  return [
    Math.round(SUN[0] + (INK[0] - SUN[0]) * ink),
    Math.round(SUN[1] + (INK[1] - SUN[1]) * ink),
    Math.round(SUN[2] + (INK[2] - SUN[2]) * ink),
  ];
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let value = n;

  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }

  return value >>> 0;
});

function crc32(bytes: Buffer): number {
  let value = 0xffffffff;

  for (const byte of bytes) {
    value = (CRC_TABLE[(value ^ byte) & 0xff] ?? 0) ^ (value >>> 8);
  }

  return (value ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const typeBytes = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBytes, data])), 0);

  return Buffer.concat([length, typeBytes, data, crc]);
}

function png(size: number): Buffer {
  const stride = size * 4 + 1;
  const pixels = Buffer.alloc(stride * size);

  const step = 1 / (size * SAMPLES);

  for (let y = 0; y < size; y += 1) {
    const rowStart = y * stride;
    pixels[rowStart] = 0;

    for (let x = 0; x < size; x += 1) {
      const [r, g, b] = blend(coverage(x / size, y / size, step));
      const offset = rowStart + 1 + x * 4;
      pixels[offset] = r;
      pixels[offset + 1] = g;
      pixels[offset + 2] = b;
      pixels[offset + 3] = 0xff;
    }
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(pixels, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const sizes = [192, 512];

await mkdir(iconDir, { recursive: true });

for (const size of sizes) {
  const target = new URL(`icon-${size}.png`, iconDir);
  await writeFile(target, png(size));
  console.log(`wrote ${target.pathname}`);
}
