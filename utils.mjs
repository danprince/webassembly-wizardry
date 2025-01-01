// @ts-check

import { readFileSync } from "node:fs";
import { fail, ok } from "node:assert";
import { execSync } from "node:child_process";
import test, { skip } from "node:test";

const debug = {
  i32: (n) => console.log(n),
  i64: (n) => console.log(n),
  f32: (n) => console.log(n),
  f64: (n) => console.log(n),
  bool: (n) => console.log(n ? true : false),
  char: (n) => console.log(String.fromCharCode(n)),
  byte: (n) => console.log(`0x${n.toString(16).padStart(2, "0")}`),
  bits: (n) => console.log(n.toString(2)),
}

/**
 * Defines a challenge.
 * @param {string} name
 * @param {(source: WebAssembly.WebAssemblyInstantiatedSource) => void} callback
 */
export async function challenge(name, callback) {
  const wat = readFileSync(`challenges/${name}.wat`, "utf-8");

  // Skip the tests that still have a SOLVE placeholder in, because they
  // probably won't actually compile.
  if (/;; SOLVE/.test(wat)) return skip(`${name} (unsolved)`);

  return test(name, async () => {
    // Compile to /tmp to keep the directory a bit cleaner
    execSync(`wat2wasm challenges/${name}.wat -o /tmp/${name}.wasm`);
    const buffer = readFileSync(`/tmp/${name}.wasm`);
    const imports = { debug };
    const wasm = await WebAssembly.instantiate(buffer, imports);
    callback(wasm);
  });
}

/**
 * A challenge that hasn't been written or solved yet.
 * @param {string} name
 * @param {(source: WebAssembly.WebAssemblyInstantiatedSource) => void} [callback]
 */
export function todo(name, callback) {
  // Do nothing!
  test.skip(name);
}

/**
 * Check that the value of the web assembly export is a function and return it.
 * @param {WebAssembly.ExportValue} exportValue
 * @returns {Function}
 */
export function expectFunc(exportValue) {
  ok(
    typeof exportValue === "function",
    "Expected export to be a WebAssembly function!",
  );
  return exportValue;
}

/**
 * @param {WebAssembly.ExportValue} exportValue
 * @returns {WebAssembly.Memory}
 */
export function expectMemory(exportValue) {
  ok(
    exportValue instanceof WebAssembly.Memory,
    "Expected export to be WebAssembly memory!",
  );
  return exportValue;
}

/**
 * Reset memory to zeros.
 * @param {WebAssembly.Memory} memory
 */
export function resetMemory(memory) {
  new Uint8Array(memory.buffer).fill(0);
}

/**
 * @param {WebAssembly.Memory} memory
 * @param {ArrayLike<number>} values
 */
export function setMemoryInt32(memory, values) {
  const view = new DataView(memory.buffer);

  for (let i = 0; i < values.length; i++) {
    view.setInt32(i * 4, values[i], true);
  }
}

/**
 * @param {WebAssembly.Memory} memory
 * @param {ArrayLike<number>} values
 */
export function setMemoryUint8(memory, values) {
  const view = new DataView(memory.buffer);

  for (let i = 0; i < values.length; i++) {
    view.setUint8(i, values[i]);
  }
}

/**
 * @param {WebAssembly.Memory} memory
 * @param {ArrayLike<number>} values
 */
export function setMemoryFloat32(memory, values) {
  const view = new DataView(memory.buffer);

  for (let i = 0; i < values.length; i++) {
    view.setFloat32(i * 4, values[i], true);
  }
}

/**
 * @param {WebAssembly.Memory} memory
 * @param {string} string
 * @param {number} [offset]
 */
export function setMemoryStringAscii(memory, string, offset) {
  if (offset === undefined) {
    resetMemory(memory);
    offset = 0;
  }

  const view = new DataView(memory.buffer);

  for (let i = 0; i < string.length; i++) {
    let code = string.charCodeAt(i);
    ok(code <= 0x0080, `Cannot encode non-ASCII character: ${string[i]}`);
    view.setUint8(offset + i, code);
  }
}

/**
 * @param {WebAssembly.Memory} memory
 * @returns {string}
 */
export function getMemoryStringAscii(memory) {
  const view = new Uint8Array(memory.buffer);
  let string = "";

  for (let i = 0; i < view.length; i++) {
    const code = view[i];
    if (code === 0x0) break;
    string += String.fromCharCode(code);
  }

  return string;
}

/**
 * @param {WebAssembly.Memory} memory
 * @param {string} string
 */
export function setMemoryStringUtf8(memory, string) {
  resetMemory(memory);
  const encoder = new TextEncoder();
  const view = new Uint8Array(memory.buffer);
  encoder.encodeInto(string, view)
}

/**
 * Parses a bitboard as though the top left bit is the first one. If we wrote
 * the bitboard out as a binary literal, the first bit in the literal will
 * actually be the last bit in memory, which makes it tricky to visually
 * compare for tests.
 * @param {(0 | 1)[]} bits
 * @return {number}
 */
export function parseBitboard(...bits) {
  let board = 0;
  for (let i = 0; i < bits.length; i++) {
    board |= bits[i] << i;
  }
  return board;
}

/**
 * Create a u32 value from an i32, reinterpreting the sign bit as a significant
 * byte.
 * @param {number} value
 */
export function u32(value) {
  return value >>> 0;
}

/**
 * Format an i32 as a single hex string.
 * @param {number} value
 * @return {string}
 */
export function hex(value) {
  return value
    .toString(16)
    .padStart(8, "0")
    .replace(/^(-?)(.*)/, "$10x$2");
}

/**
 * @param {string} char
 * @returns The ASCII value of the char.
 */
export function ascii(char) {
  return char.charCodeAt(0);
}

/**
 * Test whether two numbers are close to being equal.
 * @param {number} actual
 * @param {number} expected
 * @param {string} [message]
 */
export function equalClose(
  actual,
  expected,
  message = `${actual} is not close to ${expected}`,
) {
  if (Math.abs(actual - expected) > 0.01) {
    fail(message);
  }
}

export const SPADES = 0;
export const CLUBS = 1;
export const HEARTS = 2;
export const DIAMONDS = 3;
export const J = 11;
export const Q = 12;
export const K = 13;
export const A = 1;
