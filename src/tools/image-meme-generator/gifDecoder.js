/**
 * Minimal GIF89a decoder.
 * Returns { width, height, frames[] } where each frame has:
 *   { left, top, width, height, delay (ms), disposal, rgba (Uint8ClampedArray, full canvas size) }
 */

function readSubBlocks(data, pos) {
  const bytes = [];
  while (pos < data.length) {
    const size = data[pos++];
    if (size === 0) break;
    for (let i = 0; i < size && pos < data.length; i++) bytes.push(data[pos++]);
  }
  return { bytes: new Uint8Array(bytes), nextPos: pos };
}

function skipSubBlocks(data, pos) {
  while (pos < data.length) {
    const size = data[pos++];
    if (size === 0) break;
    pos += size;
  }
  return pos;
}

function lzwDecode(compressed, minCodeSize, pixelCount) {
  const clearCode = 1 << minCodeSize;
  const eofCode = clearCode + 1;

  let codeSize = minCodeSize + 1;
  let nextCode = eofCode + 1;

  // Code table: each entry is a Uint8Array of pixel indices
  const table = new Array(4096);
  function initTable() {
    for (let i = 0; i < clearCode; i++) table[i] = new Uint8Array([i]);
    table[clearCode] = new Uint8Array(0);
    table[eofCode] = new Uint8Array(0);
    codeSize = minCodeSize + 1;
    nextCode = eofCode + 1;
  }
  initTable();

  const output = new Uint8Array(pixelCount);
  let outPos = 0;

  // Bit reader
  let bitBuf = 0;
  let bitCount = 0;
  let dataPos = 0;

  function readCode() {
    while (bitCount < codeSize && dataPos < compressed.length) {
      bitBuf |= compressed[dataPos++] << bitCount;
      bitCount += 8;
    }
    const mask = (1 << codeSize) - 1;
    const code = bitBuf & mask;
    bitBuf >>>= codeSize;
    bitCount -= codeSize;
    return code;
  }

  let prevCode = -1;

  outer: while (dataPos < compressed.length || bitCount >= codeSize) {
    const code = readCode();

    if (code === eofCode) break;
    if (code === clearCode) {
      initTable();
      prevCode = -1;
      continue;
    }

    let entry;
    if (code < nextCode) {
      entry = table[code];
    } else if (code === nextCode && prevCode >= 0) {
      const prev = table[prevCode];
      const ext = new Uint8Array(prev.length + 1);
      ext.set(prev);
      ext[prev.length] = prev[0];
      entry = ext;
    } else {
      break; // corrupt data
    }

    // Write pixels
    for (let i = 0; i < entry.length; i++) {
      if (outPos >= pixelCount) break outer;
      output[outPos++] = entry[i];
    }

    // Add new code to table
    if (prevCode >= 0 && nextCode < 4096) {
      const prev = table[prevCode];
      const newEntry = new Uint8Array(prev.length + 1);
      newEntry.set(prev);
      newEntry[prev.length] = entry[0];
      table[nextCode++] = newEntry;
      if (nextCode === (1 << codeSize) && codeSize < 12) codeSize++;
    }

    prevCode = code;
  }

  return output;
}

export function decodeGif(buffer) {
  const data = new Uint8Array(buffer);
  let pos = 0;

  function u8() { return data[pos++]; }
  function u16() { const v = data[pos] | (data[pos + 1] << 8); pos += 2; return v; }
  function slice(n) { const s = data.slice(pos, pos + n); pos += n; return s; }

  // ── Header ──────────────────────────────────────────────────────────────────
  const sig = String.fromCharCode(data[0], data[1], data[2]);
  if (sig !== 'GIF') throw new Error('Not a GIF file');
  pos = 6;

  // ── Logical Screen Descriptor ────────────────────────────────────────────────
  const canvasW = u16();
  const canvasH = u16();
  const packed0 = u8();
  const hasGCT = (packed0 >> 7) & 1;
  const gctSize = 3 * (1 << ((packed0 & 7) + 1));
  const bgIndex = u8();
  u8(); // pixel aspect ratio

  let globalCT = null;
  if (hasGCT) {
    globalCT = slice(gctSize);
  }

  // ── Full canvas composite buffer (RGBA) ─────────────────────────────────────
  const composite = new Uint8ClampedArray(canvasW * canvasH * 4); // starts transparent
  // fill with background color if global CT present
  if (globalCT) {
    const br = globalCT[bgIndex * 3];
    const bg = globalCT[bgIndex * 3 + 1];
    const bb = globalCT[bgIndex * 3 + 2];
    for (let i = 0; i < canvasW * canvasH; i++) {
      composite[i * 4] = br;
      composite[i * 4 + 1] = bg;
      composite[i * 4 + 2] = bb;
      composite[i * 4 + 3] = 255;
    }
  }

  const frames = [];
  let gce = null;

  // ── Block loop ───────────────────────────────────────────────────────────────
  while (pos < data.length) {
    const block = u8();

    if (block === 0x3B) break; // GIF Trailer

    if (block === 0x21) {
      // Extension
      const label = u8();
      if (label === 0xF9) {
        // Graphic Control Extension
        u8(); // block size = 4
        const packedGCE = u8();
        const disposal = (packedGCE >> 2) & 7;
        const delay = u16() * 10; // centiseconds → ms (min 10ms)
        const transIdx = u8();
        const hasTransp = packedGCE & 1;
        u8(); // block terminator
        gce = {
          disposal,
          delay: delay || 100,
          transIdx: hasTransp ? transIdx : -1,
        };
      } else {
        pos = skipSubBlocks(data, pos);
      }
    } else if (block === 0x2C) {
      // Image Descriptor
      const left = u16();
      const top = u16();
      const fw = u16();
      const fh = u16();
      const packedImg = u8();
      const hasLCT = (packedImg >> 7) & 1;
      const interlaced = (packedImg >> 6) & 1;
      const lctSize = hasLCT ? 3 * (1 << ((packedImg & 7) + 1)) : 0;

      let colorTable = globalCT;
      if (hasLCT) colorTable = slice(lctSize);

      // LZW decode
      const minCodeSize = u8();
      const { bytes: lzwBytes, nextPos } = readSubBlocks(data, pos);
      pos = nextPos;
      const pixelIndices = lzwDecode(lzwBytes, minCodeSize, fw * fh);

      // Deinterlace if needed
      let indices = pixelIndices;
      if (interlaced) {
        const deint = new Uint8Array(fw * fh);
        const passes = [
          { start: 0, step: 8 },
          { start: 4, step: 8 },
          { start: 2, step: 4 },
          { start: 1, step: 2 },
        ];
        let src = 0;
        for (const { start, step } of passes) {
          for (let row = start; row < fh; row += step) {
            for (let col = 0; col < fw; col++) {
              deint[row * fw + col] = pixelIndices[src++];
            }
          }
        }
        indices = deint;
      }

      // Save previous composite state for disposal=3
      const prevComposite = composite.slice();

      // Composite this frame onto canvas
      const transIdx = gce ? gce.transIdx : -1;
      for (let row = 0; row < fh; row++) {
        for (let col = 0; col < fw; col++) {
          const cx = left + col;
          const cy = top + row;
          if (cx >= canvasW || cy >= canvasH) continue;
          const idx = indices[row * fw + col];
          if (idx === transIdx) continue; // transparent pixel — keep composite unchanged
          const cp = (cy * canvasW + cx) * 4;
          const ct = colorTable;
          if (ct) {
            composite[cp]     = ct[idx * 3];
            composite[cp + 1] = ct[idx * 3 + 1];
            composite[cp + 2] = ct[idx * 3 + 2];
            composite[cp + 3] = 255;
          }
        }
      }

      // Snapshot full composited frame for output
      frames.push({
        left, top,
        width: fw, height: fh,
        canvasW, canvasH,
        delay: gce ? gce.delay : 100,
        disposal: gce ? gce.disposal : 1,
        rgba: composite.slice(), // full canvas RGBA
      });

      // Apply disposal for next frame
      const disposal = gce ? gce.disposal : 1;
      if (disposal === 2) {
        // Restore frame area to background
        const br = globalCT ? globalCT[bgIndex * 3] : 0;
        const bg2 = globalCT ? globalCT[bgIndex * 3 + 1] : 0;
        const bb = globalCT ? globalCT[bgIndex * 3 + 2] : 0;
        const ba = globalCT ? 255 : 0;
        for (let row = 0; row < fh; row++) {
          for (let col = 0; col < fw; col++) {
            const cx = left + col;
            const cy = top + row;
            if (cx >= canvasW || cy >= canvasH) continue;
            const cp = (cy * canvasW + cx) * 4;
            composite[cp]     = br;
            composite[cp + 1] = bg2;
            composite[cp + 2] = bb;
            composite[cp + 3] = ba;
          }
        }
      } else if (disposal === 3) {
        // Restore to state before this frame
        composite.set(prevComposite);
      }
      // disposal 0 or 1: leave composite as-is

      gce = null;
    } else {
      // Unknown block — try to skip (search for next known block start)
      // Most likely corrupt data; just break
      break;
    }
  }

  return { width: canvasW, height: canvasH, frames };
}

/** Returns true if an ArrayBuffer contains an animated GIF (>1 image descriptor). */
export function isAnimatedGif(buffer) {
  const data = new Uint8Array(buffer);
  if (data[0] !== 0x47 || data[1] !== 0x49 || data[2] !== 0x46) return false; // not GIF
  let pos = 6;
  const packed = data[pos + 4];
  const hasGCT = (packed >> 7) & 1;
  const gctSize = hasGCT ? 3 * (1 << ((packed & 7) + 1)) : 0;
  pos += 7 + gctSize;
  let imageCount = 0;
  while (pos < data.length) {
    const b = data[pos++];
    if (b === 0x3B) break;
    if (b === 0x2C) {
      imageCount++;
      if (imageCount > 1) return true;
      pos += 8; // skip image descriptor fields (left, top, w, h, packed)
      const packedImg = data[pos++];
      const hasLCT = (packedImg >> 7) & 1;
      const lctSize = hasLCT ? 3 * (1 << ((packedImg & 7) + 1)) : 0;
      pos += lctSize;
      pos++; // min code size
      pos = skipSubBlocks(data, pos);
    } else if (b === 0x21) {
      pos++; // label
      pos = skipSubBlocks(data, pos);
    }
  }
  return false;
}
