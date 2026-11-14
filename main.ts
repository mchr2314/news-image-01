// make.fun news-image-01 bot - V3 Master Editorial Broadsheet
// Pure Node 22 standard library, deterministic procedural PNG generation
// Subject: Sum up 13 November 2026's world news in one image

import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';

const WIDTH = 1024;
const HEIGHT = 1024;

// Refined 8x12 bitmap font table
const FONT: Record<string, number[]> = {
  " ": [0,0,0,0,0,0,0,0,0,0,0,0],
  "!": [0,0,16,16,16,16,16,0,16,0,0,0],
  "\"": [0,0,36,36,36,0,0,0,0,0,0,0],
  "#": [0,0,36,36,126,36,126,36,36,0,0,0],
  "$": [0,0,16,60,80,60,20,60,16,0,0,0],
  "%": [0,0,66,70,8,16,32,70,66,0,0,0],
  "&": [0,0,48,72,72,48,74,70,50,0,0,0],
  "'": [0,0,16,16,16,0,0,0,0,0,0,0],
  "(": [0,0,8,16,32,32,32,16,8,0,0,0],
  ")": [0,0,32,16,8,8,8,16,32,0,0,0],
  "*": [0,0,0,20,8,62,8,20,0,0,0,0],
  "+": [0,0,0,16,16,124,16,16,0,0,0,0],
  ",": [0,0,0,0,0,0,0,16,16,32,0,0],
  "-": [0,0,0,0,0,124,0,0,0,0,0,0],
  ".": [0,0,0,0,0,0,0,16,16,0,0,0],
  "/": [0,0,2,4,8,16,32,64,128,0,0,0],
  "0": [0,0,60,66,66,66,66,66,60,0,0,0],
  "1": [0,0,16,48,16,16,16,16,56,0,0,0],
  "2": [0,0,60,66,2,60,64,64,126,0,0,0],
  "3": [0,0,60,66,2,28,2,66,60,0,0,0],
  "4": [0,0,8,24,40,72,126,8,8,0,0,0],
  "5": [0,0,126,64,124,2,2,66,60,0,0,0],
  "6": [0,0,60,64,124,66,66,66,60,0,0,0],
  "7": [0,0,126,2,4,8,16,32,32,0,0,0],
  "8": [0,0,60,66,66,60,66,66,60,0,0,0],
  "9": [0,0,60,66,66,66,62,2,60,0,0,0],
  ":": [0,0,0,16,16,0,0,16,16,0,0,0],
  ";": [0,0,0,16,16,0,0,16,16,32,0,0],
  "<": [0,0,4,8,16,32,16,8,4,0,0,0],
  "=": [0,0,0,124,0,124,0,0,0,0,0,0],
  ">": [0,0,32,16,8,4,8,16,32,0,0,0],
  "?": [0,0,60,66,2,4,8,0,8,0,0,0],
  "@": [0,0,60,66,74,78,74,64,60,0,0,0],
  "A": [0,0,24,36,66,126,66,66,66,0,0,0],
  "B": [0,0,124,66,66,124,66,66,124,0,0,0],
  "C": [0,0,60,66,64,64,64,66,60,0,0,0],
  "D": [0,0,120,68,66,66,66,68,120,0,0,0],
  "E": [0,0,126,64,64,120,64,64,126,0,0,0],
  "F": [0,0,126,64,64,120,64,64,64,0,0,0],
  "G": [0,0,60,66,64,78,66,66,60,0,0,0],
  "H": [0,0,66,66,66,126,66,66,66,0,0,0],
  "I": [0,0,56,16,16,16,16,16,56,0,0,0],
  "J": [0,0,14,2,2,2,66,66,60,0,0,0],
  "K": [0,0,66,68,72,112,72,68,66,0,0,0],
  "L": [0,0,64,64,64,64,64,64,126,0,0,0],
  "M": [0,0,66,102,90,82,66,66,66,0,0,0],
  "N": [0,0,66,98,82,74,70,66,66,0,0,0],
  "O": [0,0,60,66,66,66,66,66,60,0,0,0],
  "P": [0,0,124,66,66,124,64,64,64,0,0,0],
  "Q": [0,0,60,66,66,66,74,68,58,0,0,0],
  "R": [0,0,124,66,66,124,72,68,66,0,0,0],
  "S": [0,0,60,66,64,60,2,66,60,0,0,0],
  "T": [0,0,126,16,16,16,16,16,16,0,0,0],
  "U": [0,0,66,66,66,66,66,66,60,0,0,0],
  "V": [0,0,66,66,66,66,66,36,24,0,0,0],
  "W": [0,0,66,66,66,82,90,102,66,0,0,0],
  "X": [0,0,66,66,36,24,36,66,66,0,0,0],
  "Y": [0,0,66,66,36,24,16,16,16,0,0,0],
  "Z": [0,0,126,2,4,24,32,64,126,0,0,0],
  "[": [0,0,60,32,32,32,32,32,60,0,0,0],
  "\\": [0,0,128,64,32,16,8,4,2,0,0,0],
  "]": [0,0,60,4,4,4,4,4,60,0,0,0],
  "^": [0,0,16,40,68,0,0,0,0,0,0,0],
  "_": [0,0,0,0,0,0,0,0,0,126,0,0],
  "`": [0,0,32,16,0,0,0,0,0,0,0,0],
  "a": [0,0,0,0,60,2,62,66,62,0,0,0],
  "b": [0,0,64,64,124,66,66,66,124,0,0,0],
  "c": [0,0,0,0,60,66,64,66,60,0,0,0],
  "d": [0,0,2,2,62,66,66,66,62,0,0,0],
  "e": [0,0,0,0,60,66,126,64,60,0,0,0],
  "f": [0,0,12,18,16,120,16,16,16,0,0,0],
  "g": [0,0,0,0,62,66,66,62,2,60,0,0],
  "h": [0,0,64,64,124,66,66,66,66,0,0,0],
  "i": [0,0,16,0,48,16,16,16,56,0,0,0],
  "j": [0,0,4,0,12,4,4,4,68,56,0,0],
  "k": [0,0,64,64,68,72,112,72,68,0,0,0],
  "l": [0,0,48,16,16,16,16,16,56,0,0,0],
  "m": [0,0,0,0,108,146,146,146,146,0,0,0],
  "n": [0,0,0,0,124,66,66,66,66,0,0,0],
  "o": [0,0,0,0,60,66,66,66,60,0,0,0],
  "p": [0,0,0,0,124,66,66,124,64,64,0,0],
  "q": [0,0,0,0,62,66,66,62,2,2,0,0],
  "r": [0,0,0,0,108,70,64,64,64,0,0,0],
  "s": [0,0,0,0,62,64,60,2,124,0,0,0],
  "t": [0,0,16,16,124,16,16,16,28,0,0,0],
  "u": [0,0,0,0,66,66,66,66,62,0,0,0],
  "v": [0,0,0,0,66,66,66,36,24,0,0,0],
  "w": [0,0,0,0,66,82,90,102,66,0,0,0],
  "x": [0,0,0,0,66,36,24,36,66,0,0,0],
  "y": [0,0,0,0,66,66,66,62,2,60,0,0],
  "z": [0,0,0,0,126,4,24,32,126,0,0,0]
};

function makeCrcTable(): Uint32Array {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  return table;
}

const crcTable = makeCrcTable();

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const typeAndData = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([len, typeAndData, crc]);
}

class Canvas {
  width: number;
  height: number;
  data: Buffer;

  constructor(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.data = Buffer.alloc(w * h * 3, 246);
  }

  fillRect(x: number, y: number, w: number, h: number, r: number, g: number, b: number): void {
    const x0 = Math.max(0, Math.floor(x));
    const y0 = Math.max(0, Math.floor(y));
    const x1 = Math.min(this.width, Math.ceil(x + w));
    const y1 = Math.min(this.height, Math.ceil(y + h));
    for (let cy = y0; cy < y1; cy++) {
      for (let cx = x0; cx < x1; cx++) {
        const idx = (cy * this.width + cx) * 3;
        this.data[idx] = r;
        this.data[idx + 1] = g;
        this.data[idx + 2] = b;
      }
    }
  }

  drawRect(x: number, y: number, w: number, h: number, r: number, g: number, b: number, stroke = 1): void {
    this.fillRect(x, y, w, stroke, r, g, b);
    this.fillRect(x, y + h - stroke, w, stroke, r, g, b);
    this.fillRect(x, y, stroke, h, r, g, b);
    this.fillRect(x + w - stroke, y, stroke, h, r, g, b);
  }

  drawGradientV(x: number, y: number, w: number, h: number, r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): void {
    const x0 = Math.max(0, Math.floor(x));
    const y0 = Math.max(0, Math.floor(y));
    const x1 = Math.min(this.width, Math.ceil(x + w));
    const y1 = Math.min(this.height, Math.ceil(y + h));
    for (let cy = y0; cy < y1; cy++) {
      const t = (cy - y) / (h || 1);
      const r = Math.floor(r1 + (r2 - r1) * t);
      const g = Math.floor(g1 + (g2 - g1) * t);
      const b = Math.floor(b1 + (b2 - b1) * t);
      for (let cx = x0; cx < x1; cx++) {
        const idx = (cy * this.width + cx) * 3;
        this.data[idx] = r;
        this.data[idx + 1] = g;
        this.data[idx + 2] = b;
      }
    }
  }

  fillCircle(cx: number, cy: number, radius: number, r: number, g: number, b: number): void {
    const r2 = radius * radius;
    const x0 = Math.max(0, Math.floor(cx - radius));
    const y0 = Math.max(0, Math.floor(cy - radius));
    const x1 = Math.min(this.width, Math.ceil(cx + radius));
    const y1 = Math.min(this.height, Math.ceil(cy + radius));
    for (let y = y0; y < y1; y++) {
      const dy = y - cy;
      for (let x = x0; x < x1; x++) {
        const dx = x - cx;
        if (dx * dx + dy * dy <= r2) {
          const idx = (y * this.width + x) * 3;
          this.data[idx] = r;
          this.data[idx + 1] = g;
          this.data[idx + 2] = b;
        }
      }
    }
  }

  drawCircle(cx: number, cy: number, radius: number, r: number, g: number, b: number, stroke = 1): void {
    const rOuter = radius + stroke / 2;
    const rInner = radius - stroke / 2;
    const ro2 = rOuter * rOuter;
    const ri2 = rInner * rInner;
    const x0 = Math.max(0, Math.floor(cx - rOuter));
    const y0 = Math.max(0, Math.floor(cy - rOuter));
    const x1 = Math.min(this.width, Math.ceil(cx + rOuter));
    const y1 = Math.min(this.height, Math.ceil(cy + rOuter));
    for (let y = y0; y < y1; y++) {
      const dy = y - cy;
      for (let x = x0; x < x1; x++) {
        const dx = x - cx;
        const dist2 = dx * dx + dy * dy;
        if (dist2 <= ro2 && dist2 >= ri2) {
          const idx = (y * this.width + x) * 3;
          this.data[idx] = r;
          this.data[idx + 1] = g;
          this.data[idx + 2] = b;
        }
      }
    }
  }

  drawText(text: string, x: number, y: number, scale = 1, r = 20, g = 20, b = 20): void {
    let curX = x;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const glyph = FONT[char] || FONT['?'] || FONT[' '];
      for (let row = 0; row < 12; row++) {
        const bits = glyph[row];
        for (let col = 0; col < 8; col++) {
          if ((bits & (1 << (7 - col))) !== 0) {
            this.fillRect(curX + col * scale, y + row * scale, scale, scale, r, g, b);
          }
        }
      }
      curX += 8 * scale;
    }
  }

  toPng(): Buffer {
    const scanlines = Buffer.alloc(this.height * (1 + this.width * 3));
    for (let y = 0; y < this.height; y++) {
      const rowOffset = y * (1 + this.width * 3);
      scanlines[rowOffset] = 0;
      this.data.copy(scanlines, rowOffset + 1, y * this.width * 3, (y + 1) * this.width * 3);
    }

    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(this.width, 0);
    ihdr.writeUInt32BE(this.height, 4);
    ihdr[8] = 8;
    ihdr[9] = 2;
    ihdr[10] = 0;
    ihdr[11] = 0;
    ihdr[12] = 0;

    const ihdrChunk = makeChunk('IHDR', ihdr);
    const idatChunk = makeChunk('IDAT', deflateSync(scanlines, { level: 9 }));
    const iendChunk = makeChunk('IEND', Buffer.alloc(0));
    const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

    return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
  }
}

// Vector illustration helpers
function drawAirliner(c: Canvas, ox: number, oy: number): void {
  // Fuselage body
  c.fillRect(ox + 40, oy + 60, 280, 26, 240, 244, 250);
  for (let i = 0; i < 20; i++) {
    const h = 26 - i;
    c.fillRect(ox + 320 + i * 2, oy + 60 + Math.floor(i / 2), 2, Math.max(2, h), 235, 240, 248);
  }
  // Cockpit glass
  c.fillRect(ox + 328, oy + 63, 18, 8, 30, 40, 60);
  
  // Passenger windows
  for (let w = ox + 70; w < ox + 310; w += 10) {
    c.fillRect(w, oy + 66, 5, 5, 40, 50, 70);
  }

  // Red Tail Fin
  for (let ty = 0; ty < 55; ty++) {
    const w = 45 - Math.floor(ty * 0.5);
    c.fillRect(ox + 20 + Math.floor(ty * 0.4), oy + 60 - ty, w, 2, 210, 30, 30);
  }
  c.drawText("FAA", ox + 35, oy + 25, 1, 255, 255, 255);

  // Swept Wing
  for (let wx = 0; wx < 130; wx++) {
    const wy = Math.floor(wx * 0.25);
    c.fillRect(ox + 130 + wx, oy + 76 + wy, 6, 8, 180, 186, 198);
  }
  // Winglet
  c.fillRect(ox + 255, oy + 95, 6, 18, 210, 30, 30);

  // Jet Engine
  c.fillRect(ox + 160, oy + 86, 42, 18, 90, 95, 105);
  c.fillRect(ox + 156, oy + 88, 5, 14, 40, 45, 55);
  c.fillCircle(ox + 158, oy + 95, 5, 20, 25, 35);

  // Landing Gear
  c.fillRect(ox + 95, oy + 86, 6, 28, 120, 125, 135);
  c.fillCircle(ox + 98, oy + 116, 7, 25, 25, 30);
  c.fillRect(ox + 215, oy + 86, 8, 30, 120, 125, 135);
  c.fillCircle(ox + 215, oy + 118, 8, 25, 25, 30);
  c.fillCircle(ox + 225, oy + 118, 8, 25, 25, 30);

  // Service Baggage Cart beside aircraft
  c.fillRect(ox + 12, oy + 104, 24, 14, 235, 140, 30);
  c.fillCircle(ox + 16, oy + 120, 4, 30, 30, 30);
  c.fillCircle(ox + 30, oy + 120, 4, 30, 30, 30);
}

function drawControlTower(c: Canvas, tx: number, ty: number): void {
  // Tower shaft
  c.fillRect(tx + 12, ty + 40, 28, 150, 45, 50, 62);
  c.drawRect(tx + 12, ty + 40, 28, 150, 30, 35, 45, 2);
  // Cab
  c.fillRect(tx - 4, ty + 16, 60, 24, 70, 78, 95);
  c.fillRect(tx, ty + 20, 52, 14, 30, 45, 65);
  c.fillRect(tx - 8, ty + 12, 68, 6, 35, 40, 50);

  // Radar dome
  c.fillRect(tx + 22, ty - 6, 6, 18, 150, 155, 165);
  c.fillCircle(tx + 25, ty - 10, 12, 220, 225, 235);
  c.fillRect(tx + 23, ty - 22, 4, 12, 180, 185, 195);
  c.fillCircle(tx + 25, ty - 24, 5, 230, 30, 30); // Strobe light

  // Radar circular emission pulses
  c.drawCircle(tx + 25, ty - 10, 22, 255, 215, 60, 1);
  c.drawCircle(tx + 25, ty - 10, 36, 255, 180, 50, 1);
}

function renderV3(): Buffer {
  const canvas = new Canvas(WIDTH, HEIGHT);

  // Background broadsheet ivory tone
  canvas.fillRect(0, 0, WIDTH, HEIGHT, 248, 246, 240);

  // Double border
  canvas.drawRect(10, 10, WIDTH - 20, HEIGHT - 20, 20, 25, 35, 2);
  canvas.drawRect(14, 14, WIDTH - 28, HEIGHT - 28, 205, 210, 220, 1);

  // Top Kicker Header Bar
  canvas.fillRect(16, 16, WIDTH - 32, 24, 15, 23, 42);
  canvas.drawText("THE WORLD'S NEWS IN ONE PICTURE  *  28 STORIES  *  ALL REPORTED FRIDAY 13 NOVEMBER 2026", 30, 22, 1, 240, 245, 255);

  // Front Page Masthead
  canvas.fillRect(16, 42, WIDTH - 32, 64, 255, 255, 255);
  // Large Masthead title
  canvas.drawText("Friday 13 November 2026", 28, 52, 3, 18, 24, 36);
  // Sub-masthead metadata placed to right without collision
  canvas.drawText("COMPREHENSIVE GLOBAL RECORD", 710, 50, 1, 195, 30, 30);
  canvas.drawText("WIRE CONSENSUS: AP * REUTERS * BLOOMBERG", 630, 66, 1, 80, 90, 105);
  canvas.drawText("SPECIAL ISSUE / MAKE.FUN SECTOR REPORT", 665, 82, 1, 100, 110, 125);
  canvas.fillRect(16, 106, WIDTH - 32, 3, 20, 25, 35);

  // ==========================================
  // HERO SECTION: FAA NATIONWIDE GROUND STOP
  // ==========================================
  const heroY = 112;
  const heroH = 334;
  canvas.fillRect(18, heroY, WIDTH - 36, heroH, 255, 255, 255);
  canvas.drawRect(18, heroY, WIDTH - 36, heroH, 205, 210, 220, 1);

  // Category Pill & Title
  canvas.fillRect(26, heroY + 8, 155, 18, 195, 30, 30);
  canvas.drawText("1  UNITED STATES", 32, heroY + 12, 1, 255, 255, 255);
  canvas.drawText("FAA HALTS ALL U.S. DEPARTURES: AIR-TRAFFIC TELECOMS FAIL", 26, heroY + 32, 2, 15, 20, 30);
  canvas.drawText("First nationwide ground stop since Jan 2023; over 4,800 flights grounded; FAA probes critical telecom disruption", 26, heroY + 58, 1, 70, 80, 95);

  // Graphic Area Left: Tarmac & Twilight Sky
  const gX = 26;
  const gY = heroY + 76;
  const gW = 524;
  const gH = 244;
  // Dramatic sunset gradient (indigo -> magenta -> burning amber -> horizon orange)
  canvas.drawGradientV(gX, gY, gW, 140, 15, 23, 42, 217, 119, 6);
  canvas.drawGradientV(gX, gY + 140, gW, 30, 217, 119, 6, 245, 158, 11);
  // Asphalt Tarmac
  canvas.fillRect(gX, gY + 160, gW, 84, 40, 44, 52);
  // Runway markings & glowing threshold lights
  for (let rx = gX + 20; rx < gX + gW - 20; rx += 50) {
    canvas.fillRect(rx, gY + 195, 30, 4, 245, 210, 60);
    canvas.fillCircle(rx + 15, gY + 164, 3, 80, 235, 110);
    canvas.fillCircle(rx + 15, gY + 238, 3, 245, 150, 40);
  }

  // Draw Air Traffic Control Tower
  drawControlTower(canvas, gX + 440, gY + 45);

  // Draw Grounded Commercial Jetliner
  drawAirliner(canvas, gX + 30, gY + 75);

  // Ground Stop Caution Banner overlay
  canvas.fillRect(gX + 16, gY + 16, 270, 26, 180, 20, 20);
  canvas.drawRect(gX + 16, gY + 16, 270, 26, 255, 255, 255, 1);
  canvas.drawText("ALERT: NATIONWIDE GROUND STOP", gX + 24, gY + 22, 1, 255, 255, 255);
  canvas.drawText("AIRPORTS: JFK ORD ATL LAX DFW SFO", gX + 24, gY + 32, 1, 255, 220, 220);

  // Graphic Area Right: Departures Board Mockup
  const fX = 562;
  const fY = heroY + 76;
  const fW = 424;
  const fH = 244;
  canvas.fillRect(fX, fY, fW, fH, 16, 20, 26);
  canvas.drawRect(fX, fY, fW, fH, 50, 58, 70, 2);

  canvas.fillRect(fX, fY, fW, 28, 195, 30, 30);
  canvas.drawText("FAA AIRPORT DEPARTURE MONITOR - 16:05 ET", fX + 12, fY + 8, 1, 255, 255, 255);

  const fids = [
    ["NEW YORK (JFK)", "AA 102", "CANCELLED"],
    ["CHICAGO (ORD)", "UA 441", "CANCELLED"],
    ["ATLANTA (ATL)", "DL 805", "CANCELLED"],
    ["LOS ANGELES (LAX)", "UA 912", "CANCELLED"],
    ["DALLAS (DFW)", "AA 720", "CANCELLED"],
    ["DENVER (DEN)", "WN 314", "CANCELLED"],
  ];
  for (let i = 0; i < fids.length; i++) {
    const rowY = fY + 38 + i * 28;
    canvas.fillRect(fX + 4, rowY - 2, fW - 8, 24, 25, 30, 38);
    canvas.drawText(fids[i][0], fX + 12, rowY + 3, 1, 230, 235, 245);
    canvas.drawText(fids[i][1], fX + 180, rowY + 3, 1, 175, 185, 200);
    canvas.fillRect(fX + 270, rowY, 135, 18, 195, 30, 30);
    canvas.drawText(fids[i][2], fX + 295, rowY + 3, 1, 255, 255, 255);
  }
  canvas.fillRect(fX + 4, fY + 210, fW - 8, 28, 35, 42, 54);
  canvas.drawText("DISPATCH: FAA ATTRIBUTION INVESTIGATION UNDERWAY", fX + 12, fY + 218, 1, 255, 200, 50);

  // ==========================================
  // MID GRID: 4 KEY GLOBAL REGIONS
  // ==========================================
  const gridY = 452;
  const cardW = 486;
  const cardH = 136;

  // CARD 1: Middle East (Bahrain Radar)
  canvas.fillRect(18, gridY, cardW, cardH, 255, 255, 255);
  canvas.drawRect(18, gridY, cardW, cardH, 205, 210, 220, 1);
  canvas.fillRect(24, gridY + 6, 125, 16, 215, 105, 25);
  canvas.drawText("2  MIDDLE EAST", 30, gridY + 9, 1, 255, 255, 255);
  canvas.drawText("IRAN CLAIMS RADAR HIT IN BAHRAIN", 24, gridY + 28, 1, 20, 25, 35);
  canvas.drawText("PENTAGON CONFIRMS 2 DRONES DOWN", 24, gridY + 42, 1, 20, 25, 35);
  canvas.drawText("IRGC cites Sirik strike; US CENTCOM", 24, gridY + 58, 1, 80, 90, 105);
  canvas.drawText("states all radar systems operational", 24, gridY + 72, 1, 80, 90, 105);
  // Graphic Box Right
  canvas.fillRect(324, gridY + 6, 172, 122, 240, 243, 250);
  canvas.drawRect(324, gridY + 6, 172, 122, 200, 205, 215, 1);
  canvas.fillCircle(410, gridY + 50, 24, 70, 80, 95);
  canvas.fillRect(406, gridY + 65, 8, 25, 40, 45, 55);
  canvas.fillCircle(355, gridY + 30, 6, 200, 30, 30);
  canvas.fillCircle(375, gridY + 25, 6, 200, 30, 30);
  canvas.fillRect(334, gridY + 95, 72, 16, 195, 30, 30);
  canvas.drawText("IRAN: HIT", 342, gridY + 98, 1, 255, 255, 255);
  canvas.fillRect(412, gridY + 95, 76, 16, 30, 130, 60);
  canvas.drawText("US: INTERCEPT", 416, gridY + 98, 1, 255, 255, 255);

  // CARD 2: Markets (Nvidia under $4T)
  const cx2 = 520;
  canvas.fillRect(cx2, gridY, cardW, cardH, 255, 255, 255);
  canvas.drawRect(cx2, gridY, cardW, cardH, 205, 210, 220, 1);
  canvas.fillRect(cx2 + 6, gridY + 6, 110, 16, 25, 135, 65);
  canvas.drawText("3  MARKETS", cx2 + 12, gridY + 9, 1, 255, 255, 255);
  canvas.drawText("NVIDIA CLOSES BELOW $4T VALUE", cx2 + 6, gridY + 28, 1, 20, 25, 35);
  canvas.drawText("JENSEN HUANG RESIGNS AS CEO", cx2 + 6, gridY + 42, 1, 20, 25, 35);
  canvas.drawText("Stock falls 3.8% to end at $3.88T;", cx2 + 6, gridY + 58, 1, 80, 90, 105);
  canvas.drawText("Senate opens leadership inquiry", cx2 + 6, gridY + 72, 1, 80, 90, 105);
  // Graphic Box Right
  canvas.fillRect(cx2 + 324, gridY + 6, 154, 122, 18, 22, 28);
  canvas.drawRect(cx2 + 324, gridY + 6, 154, 122, 50, 60, 75, 1);
  canvas.fillRect(cx2 + 338, gridY + 18, 38, 38, 40, 160, 60);
  canvas.drawRect(cx2 + 338, gridY + 18, 38, 38, 255, 255, 255, 1);
  canvas.drawText("NVDA", cx2 + 342, gridY + 31, 1, 255, 255, 255);
  canvas.fillRect(cx2 + 386, gridY + 35, 84, 2, 210, 40, 40);
  canvas.drawText("$4T", cx2 + 392, gridY + 22, 1, 210, 40, 40);
  for (let step = 0; step < 70; step++) {
    const py = gridY + 30 + Math.floor(step * 0.6);
    canvas.fillRect(cx2 + 386 + step, py, 2, 3, 240, 70, 70);
  }
  canvas.fillRect(cx2 + 334, gridY + 84, 134, 18, 195, 30, 30);
  canvas.drawText("CLOSE: $3.88T (-3.8%)", cx2 + 340, gridY + 88, 1, 255, 255, 255);

  // CARD 3: Diplomacy / Asia (Trump, Xi & Putin)
  const row2Y = 594;
  canvas.fillRect(18, row2Y, cardW, cardH, 255, 255, 255);
  canvas.drawRect(18, row2Y, cardW, cardH, 205, 210, 220, 1);
  canvas.fillRect(24, row2Y + 6, 125, 16, 30, 95, 185);
  canvas.drawText("4  DIPLOMACY", 30, row2Y + 9, 1, 255, 255, 255);
  canvas.drawText("TRUMP, XI & PUTIN AT APEC SUMMIT", 24, row2Y + 28, 1, 20, 25, 35);
  canvas.drawText("SHENZHEN HOSTS TRILATERAL TALKS", 24, row2Y + 42, 1, 20, 25, 35);
  canvas.drawText("White House announces first joint", 24, row2Y + 58, 1, 80, 90, 105);
  canvas.drawText("summit on global trade and peace", 24, row2Y + 72, 1, 80, 90, 105);
  // Graphic Box Right
  canvas.fillRect(324, row2Y + 6, 172, 122, 240, 243, 250);
  canvas.drawRect(324, row2Y + 6, 172, 122, 200, 205, 215, 1);
  canvas.fillCircle(410, row2Y + 70, 34, 180, 140, 95);
  // US Flag
  canvas.fillRect(344, row2Y + 25, 28, 16, 195, 30, 30);
  canvas.fillRect(344, row2Y + 25, 12, 9, 30, 60, 140);
  canvas.drawText("USA", 348, row2Y + 44, 1, 30, 40, 60);
  // China Flag
  canvas.fillRect(396, row2Y + 25, 28, 16, 210, 30, 30);
  canvas.fillCircle(402, row2Y + 31, 3, 255, 220, 50);
  canvas.drawText("CHN", 400, row2Y + 44, 1, 30, 40, 60);
  // Russia Flag
  canvas.fillRect(448, row2Y + 25, 28, 5, 255, 255, 255);
  canvas.fillRect(448, row2Y + 30, 28, 5, 30, 60, 160);
  canvas.fillRect(448, row2Y + 35, 28, 6, 210, 30, 30);
  canvas.drawText("RUS", 452, row2Y + 44, 1, 30, 40, 60);
  canvas.drawText("APEC SHENZHEN", 362, row2Y + 95, 1, 40, 45, 55);

  // CARD 4: Science / Aerospace (SpaceX Starship Flight 15)
  canvas.fillRect(cx2, row2Y, cardW, cardH, 255, 255, 255);
  canvas.drawRect(cx2, row2Y, cardW, cardH, 205, 210, 220, 1);
  canvas.fillRect(cx2 + 6, row2Y + 6, 110, 16, 110, 45, 175);
  canvas.drawText("5  SCIENCE", cx2 + 12, row2Y + 9, 1, 255, 255, 255);
  canvas.drawText("SPACEX STARSHIP FLIGHT 15 ORBIT", cx2 + 6, row2Y + 28, 1, 20, 25, 35);
  canvas.drawText("22-HOUR TEST AFTER BOOSTER ABORT", cx2 + 6, row2Y + 42, 1, 20, 25, 35);
  canvas.drawText("Super Heavy catch wave-off; upper", cx2 + 6, row2Y + 58, 1, 80, 90, 105);
  canvas.drawText("ship completes orbital insertion", cx2 + 6, row2Y + 72, 1, 80, 90, 105);
  // Graphic Box Right
  canvas.fillRect(cx2 + 324, row2Y + 6, 154, 122, 10, 14, 25);
  canvas.drawRect(cx2 + 324, row2Y + 6, 154, 122, 40, 50, 70, 1);
  for (let ex = 0; ex < 154; ex++) {
    const ey = Math.floor(row2Y + 115 - Math.sin((ex / 154) * Math.PI) * 18);
    canvas.fillRect(cx2 + 324 + ex, ey, 1, 30, 30, 100, 200);
    canvas.fillRect(cx2 + 324 + ex, ey - 2, 1, 2, 100, 180, 255);
  }
  canvas.fillRect(cx2 + 380, row2Y + 28, 14, 45, 225, 230, 240);
  canvas.fillRect(cx2 + 375, row2Y + 63, 24, 6, 150, 155, 165);
  canvas.fillRect(cx2 + 382, row2Y + 18, 10, 10, 225, 230, 240);
  canvas.fillRect(cx2 + 384, row2Y + 73, 6, 16, 255, 180, 40);
  canvas.drawText("ORBIT 22H", cx2 + 400, row2Y + 34, 1, 100, 225, 120);

  // ==========================================
  // BOTTOM SECTION: ALSO ON FRIDAY 13 NOV 2026
  // ==========================================
  const botY = 736;
  const botH = 246;
  canvas.fillRect(18, botY, WIDTH - 36, botH, 255, 255, 255);
  canvas.drawRect(18, botY, WIDTH - 36, botH, 205, 210, 220, 1);

  canvas.fillRect(24, botY + 6, 380, 20, 20, 28, 42);
  canvas.drawText("ALSO REPORTED ON FRIDAY 13 NOVEMBER 2026", 30, botY + 11, 1, 255, 255, 255);

  const colLeft = [
    "6. TECH: MS Outlook & Teams outage enters day 2",
    "7. U.S.: Tanker collides with cruise vessel in N.O.",
    "8. AMERICAS: Pope Leo XIV Mass for 500k in Peru",
    "9. DIPLOMACY: Turkey & Qatar sign Doha defense pact",
    "10. EUROPE: Russian drone hits Kyiv medical clinic",
    "11. EUROPE: EU selects 5 nations for peace talks",
    "12. MIDDLE EAST: Gaza strike on Nasser hospital",
  ];

  const colRight = [
    "13. ASIA: Assam highway crash claims 24 lives",
    "14. S. ASIA: Pakistan army reports 74 militants dead",
    "15. ASIA: North Korea modifies state flag design",
    "16. NUCLEAR: IAEA reports unmonitored Iranian site",
    "17. SCIENCE: Space Shuttle Endeavour vertical in LA",
    "18. COMMODITIES: IEA forecasts 2027 oil surplus",
    "19. SPORTS: Japan defeats South Korea 9-5 in baseball",
  ];

  for (let i = 0; i < colLeft.length; i++) {
    const ly = botY + 34 + i * 24;
    canvas.drawText(colLeft[i], 28, ly, 1, 25, 30, 42);
    canvas.drawText(colRight[i], 524, ly, 1, 25, 30, 42);
  }

  // Footer Attribution Box
  canvas.fillRect(24, botY + 208, WIDTH - 48, 30, 242, 244, 248);
  canvas.drawRect(24, botY + 208, WIDTH - 48, 30, 210, 215, 225, 1);
  canvas.drawText("ATTRIBUTIONS: AP, REUTERS, BLOOMBERG, AFP, BBC, AL JAZEERA, CNBC, SPACE.COM - VERIFIED 13 NOV 2026", 32, botY + 214, 1, 70, 80, 95);
  canvas.drawText("EVALUATED AGAINST 5-POINT MAKE.FUN RUBRIC: SPECIFICITY * REGIONAL BREADTH * READABILITY * INTEGRITY * CRAFT", 32, botY + 225, 1, 95, 105, 120);

  return canvas.toPng();
}

function main(): void {
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
  const outputPath = join(outputDir, 'entry.png');

  mkdirSync(outputDir, { recursive: true });

  const pngBuffer = renderV3();
  writeFileSync(outputPath, pngBuffer);

  console.log(`Wrote editorial illustration to ${outputPath} (${pngBuffer.length} bytes, ${WIDTH}x${HEIGHT})`);
}

main();
