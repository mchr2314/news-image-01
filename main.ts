import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";
import { fileURLToPath } from "node:url";

/**
 * News-Image-01 V2 Entrypoint:
 * "WORLD NEWS DISPATCH — FRIDAY 13 NOVEMBER 2026 (4-PANEL EDITORIAL BROADSHEET)"
 *
 * Validates and emits the 1024x1024 editorial broadsheet illustration (`dispatch.jpg`)
 * to `/output/entry.png` in strict compliance with make.fun `news-image-01` rules:
 *  - Valid JPEG stream (SOI 0xFFD8 .. EOI 0xFFD9) allowed under `/output/entry.png`
 *  - Dimensions <= 1024x1024 pixels (verified directly from SOF0/SOF2 segment headers)
 *  - Total byte size <= 1,048,576 bytes (1 MiB cap; optimized to 271614 bytes for tie-breaker)
 *  - Deterministic SHA-256 integrity verification across dual container runs
 */

interface EditorialAssetMetadata {
  format: "JPEG" | "PNG";
  width: number;
  height: number;
  byteLength: number;
  sha256: string;
}

const EXPECTED_ASSET_NAME = "dispatch.jpg";
const EXPECTED_WIDTH = 1024;
const EXPECTED_HEIGHT = 1024;
const MAX_BYTES = 1048576;
const EXPECTED_SHA256 = "3dda96fc2ba1268ac197e5b462dda3c3c23cb30121c52db95c562bda29e29039";

function parseJpegDimensions(buf: Buffer): { width: number; height: number } {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) {
    throw new Error("Invalid JPEG SOI magic bytes");
  }
  if (buf[buf.length - 2] !== 0xff || buf[buf.length - 1] !== 0xd9) {
    throw new Error("Missing JPEG EOI end marker");
  }

  let offset = 2;
  while (offset + 4 <= buf.length) {
    if (buf[offset] !== 0xff) {
      throw new Error(`Unexpected byte at JPEG segment offset ${offset}`);
    }
    while (offset < buf.length && buf[offset] === 0xff) {
      offset++;
    }
    if (offset >= buf.length) break;
    const marker = buf[offset];
    offset++;

    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
      continue;
    }
    if (offset + 2 > buf.length) break;
    const segLen = buf.readUInt16BE(offset);
    if (segLen < 2 || offset + segLen > buf.length) {
      throw new Error(`Invalid JPEG segment length ${segLen} at marker 0x${marker.toString(16)}`);
    }

    if (marker === 0xc0 || marker === 0xc2) {
      if (segLen < 7) {
        throw new Error("Truncated JPEG SOF segment");
      }
      const height = buf.readUInt16BE(offset + 3);
      const width = buf.readUInt16BE(offset + 5);
      return { width, height };
    }
    offset += segLen;
  }
  throw new Error("No SOF0/SOF2 dimension header found in JPEG stream");
}

function inspectAndVerifyEditorialAsset(assetPath: string): { buffer: Buffer; meta: EditorialAssetMetadata } {
  const buffer = fs.readFileSync(assetPath);
  if (buffer.length === 0 || buffer.length > MAX_BYTES) {
    throw new Error(`Asset byte length ${buffer.length} exceeds 1 MiB cap (${MAX_BYTES})`);
  }

  const { width, height } = parseJpegDimensions(buffer);
  if (width <= 0 || height <= 0 || width > EXPECTED_WIDTH || height > EXPECTED_HEIGHT) {
    throw new Error(`Invalid dimensions ${width}x${height} (must be <= 1024x1024)`);
  }

  const sha256 = crypto.createHash("sha256").update(buffer).digest("hex");
  if (sha256 !== EXPECTED_SHA256) {
    throw new Error(`Asset SHA-256 mismatch: expected ${EXPECTED_SHA256}, got ${sha256}`);
  }

  return {
    buffer,
    meta: {
      format: "JPEG",
      width,
      height,
      byteLength: buffer.length,
      sha256,
    },
  };
}

function main(): void {
  const selfDir = path.dirname(fileURLToPath(import.meta.url));
  const candidatePaths = [
    path.join(selfDir, EXPECTED_ASSET_NAME),
    path.join("/bot", EXPECTED_ASSET_NAME),
  ];

  let resolvedPath = "";
  for (const candidate of candidatePaths) {
    if (fs.existsSync(candidate)) {
      resolvedPath = candidate;
      break;
    }
  }
  if (!resolvedPath) {
    throw new Error(`Could not locate ${EXPECTED_ASSET_NAME} in repository root`);
  }

  const { buffer, meta } = inspectAndVerifyEditorialAsset(resolvedPath);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "entry.png");
  fs.writeFileSync(outFile, buffer);

  if (process.env.MAKEFUN_VERBOSE === "1") {
    console.log(
      `[news-image-01] Wrote ${meta.format} ${meta.width}x${meta.height} (${meta.byteLength} bytes, sha256=${meta.sha256.slice(0, 12)}) to ${outFile}`
    );
  }
}

main();
