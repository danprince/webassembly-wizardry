// @ts-check

import { equal } from "node:assert";
import {
  challenge,
  equalClose,
  expectFunc,
  expectMemory,
  hex,
  parseBitboard,
  resetMemory,
  setMemoryFloat32,
  setMemoryInt32,
  setMemoryStringAscii,
  setMemoryUint8,
  todo,
  CLUBS,
  DIAMONDS,
  HEARTS,
  SPADES,
  A,
  K,
  ascii,
  setMemoryStringUtf8,
  getMemoryStringAscii,
  u32,
} from "./utils.mjs";

// --- Arithmetic Challenges ---

challenge("increment", (wasm) => {
  const increment = expectFunc(wasm.instance.exports.increment);
  equal(increment(0), 1);
  equal(increment(2), 3);
  equal(increment(10), 11);
  equal(increment(-4), -3);
});

challenge("double", (wasm) => {
  const double = expectFunc(wasm.instance.exports.double);
  equal(double(0), 0);
  equal(double(2), 4);
  equal(double(10), 20);
  equal(double(-4), -8);
});

challenge("max", (wasm) => {
  const max = expectFunc(wasm.instance.exports.max);

  // Positive numbers
  equal(max(1, 10), 10);
  equal(max(10, 1), 10);
  equal(max(0, 1), 1);
  equal(max(100, 99), 100);
  equal(max(0, 0), 0);

  // Signed comparisons
  equal(max(5, -5), 5);
  equal(max(5, -6), 5);
  equal(max(5, -4), 5);

  // Negative numbers
  equal(max(-10, -20), -10);
  equal(max(-20, -10), -10);
  equal(max(-1, -1), -1);
  equal(max(-100, -50), -50);

  // Mixing large and small numbers
  equal(max(1, 1000000000), 1000000000);
  equal(max(-1, -1000000000), -1);
});

challenge("abs", (wasm) => {
  const abs = expectFunc(wasm.instance.exports.abs);

  // Basic absolute value tests
  equal(abs(0), 0);
  equal(abs(1), 1);
  equal(abs(-1), 1);

  // Larger positive numbers
  equal(abs(123), 123);
  equal(abs(1000), 1000);

  // Larger negative numbers
  equal(abs(-123), 123);
  equal(abs(-1000), 1000);

  // Edge cases for i32 limits
  equal(abs(2147483647), 2147483647); // Max i32 positive value
  equal(abs(-2147483647), 2147483647); // Max i32 negative value

  // Edge case for minimum i32 value (abs can't represent -2147483648 as positive in i32)
  equal(abs(-2147483648), -2147483648); // This will stay the same since there's no positive counterpart in i32
});

challenge("even", (wasm) => {
  const even = expectFunc(wasm.instance.exports.even);

  // Basic positive numbers
  equal(even(0), 1);
  equal(even(1), 0);
  equal(even(2), 1);
  equal(even(3), 0);
  equal(even(10), 1);
  equal(even(11), 0);
  equal(even(100), 1);
  equal(even(101), 0);

  // Larger positive numbers
  equal(even(999999), 0);
  equal(even(1000000), 1);
  equal(even(2147483646), 1);
  equal(even(2147483647), 0);

  // Negative numbers
  equal(even(-1), 0);
  equal(even(-2), 1);
  equal(even(-10), 1);
  equal(even(-11), 0);
  equal(even(-100), 1);
  equal(even(-101), 0);

  // Larger negative numbers
  equal(even(-999999), 0);
  equal(even(-1000000), 1);
  equal(even(-2147483648), 1);
  equal(even(-2147483647), 0);
});

challenge("pow", (wasm) => {
  const pow = expectFunc(wasm.instance.exports.pow);

  // Basic powers
  equal(pow(2, 0), 1);
  equal(pow(2, 1), 2);
  equal(pow(2, 2), 4);
  equal(pow(2, 3), 8);
  equal(pow(3, 3), 27);
  equal(pow(5, 2), 25);

  // Edge case: base raised to power of 0
  equal(pow(10, 0), 1);
  equal(pow(100, 0), 1);

  // Larger powers
  equal(pow(2, 10), 1024);
  equal(pow(3, 5), 243);
  equal(pow(5, 5), 3125);

  // Large base, small exponent
  equal(pow(1000, 2), 1000000);
  equal(pow(10000, 1), 10000);

  // Edge case: power of 1
  equal(pow(1, 100), 1);
  equal(pow(1, 0), 1);

  // Edge case: power of 0 for negative base
  equal(pow(-2, 0), 1);

  // Negative base with positive exponents
  equal(pow(-2, 1), -2);
  equal(pow(-2, 2), 4);
  equal(pow(-2, 3), -8);

  // Edge case: exponent is zero for negative base
  equal(pow(-10, 0), 1);
});

challenge("triangular", (wasm) => {
  const triangular = expectFunc(wasm.instance.exports.triangular);

  // Basic triangular numbers
  equal(triangular(0), 0);
  equal(triangular(1), 1);
  equal(triangular(2), 3);
  equal(triangular(3), 6);
  equal(triangular(4), 10);
  equal(triangular(5), 15);
  equal(triangular(6), 21);
  equal(triangular(7), 28);
  equal(triangular(10), 55);

  // Larger triangular numbers
  equal(triangular(100), 5050);
  equal(triangular(1000), 500500);
  equal(triangular(10000), 50005000);

  // Edge case for large n
  equal(triangular(65535), 2147450880);

  // Negative input case (if it should return 0 for negative inputs)
  equal(triangular(-1), 0);
  equal(triangular(-10), 0);
});

challenge("lerp", (wasm) => {
  const lerp = expectFunc(wasm.instance.exports.lerp);

  // Basic linear interpolation
  equal(lerp(0.0, 10.0, 0.0), 0.0);
  equal(lerp(0.0, 10.0, 1.0), 10.0);
  equal(lerp(0.0, 10.0, 0.5), 5.0);
  equal(lerp(10.0, 0.0, 0.5), 5.0);

  // Extrapolation beyond bounds
  equal(lerp(0.0, 10.0, 1.1), 11.0);
  equal(lerp(0.0, 10.0, -0.1), -1.0);
  equal(lerp(10.0, 0.0, 1.1), -1.0);

  // Testing with negative values
  equal(lerp(-10.0, 10.0, 0.5), 0.0);
  equal(lerp(-10.0, 10.0, 0.0), -10.0);
  equal(lerp(-10.0, 10.0, 1.0), 10.0);

  // Testing with very small t
  equal(lerp(100.0, 200.0, 0.01), 101.0);
  equal(lerp(100.0, 200.0, 0.99), 199.0);

  // Testing with $a and $b equal
  equal(lerp(5.0, 5.0, 0.0), 5.0);
  equal(lerp(5.0, 5.0, 1.0), 5.0);
  equal(lerp(5.0, 5.0, 0.5), 5.0);
});

challenge("between", (wasm) => {
  const between = expectFunc(wasm.instance.exports.between);

  // Basic tests with $a < $b
  equal(between(0, 10, 5), 1);
  equal(between(0, 10, 0), 1);
  equal(between(0, 10, 10), 1);
  equal(between(0, 10, 11), 0);

  // Basic tests with $a > $b (reversed range)
  equal(between(10, 0, 5), 1);
  equal(between(10, 0, 0), 1);
  equal(between(10, 0, 10), 1);
  equal(between(10, 0, -1), 0);

  // Edge cases at the bounds
  equal(between(-10, 10, -10), 1);
  equal(between(-10, 10, 10), 1);
  equal(between(-10, 10, -11), 0);
  equal(between(-10, 10, 11), 0);

  // Tests with negative values
  equal(between(-10, -5, -7), 1);
  equal(between(-10, -5, -10), 1);
  equal(between(-10, -5, -5), 1);
  equal(between(-10, -5, -4), 0);

  // Tests with reversed negative range
  equal(between(-5, -10, -7), 1);
  equal(between(-5, -10, -5), 1);
  equal(between(-5, -10, -10), 1);
  equal(between(-5, -10, -11), 0);

  // Tests with very small range
  equal(between(0, 1, 0), 1);
  equal(between(0, 1, 1), 1);
  equal(between(0, 1, 2), 0);

  // Tests with large numbers
  equal(between(1000000, 0, 500000), 1);
  equal(between(1000000, 0, 1000000), 1);
  equal(between(1000000, 0, 1000001), 0);
  equal(between(-1000000, 1000000, 0), 1);
});

challenge("clamp", (wasm) => {
  const clamp = expectFunc(wasm.instance.exports.clamp);

  // Basic clamping tests
  equal(clamp(0, 10, 5), 5);
  equal(clamp(0, 10, 0), 0);
  equal(clamp(0, 10, 10), 10);

  // Clamping outside the range
  equal(clamp(0, 10, -1), 0); // Below the minimum, should return min
  equal(clamp(0, 10, 11), 10); // Above the maximum, should return max

  // Edge cases at the bounds
  equal(clamp(0, 0, 0), 0); // min == max, val == min == max
  equal(clamp(-10, -10, -10), -10); // min == max, val == min == max

  // Tests with negative ranges
  equal(clamp(-10, 0, -5), -5); // Within the range
  equal(clamp(-10, 0, -11), -10); // Below the range, should return min
  equal(clamp(-10, 0, 1), 0); // Above the range, should return max

  // Tests with very small range
  equal(clamp(0, 1, 0), 0);
  equal(clamp(0, 1, 1), 1);
  equal(clamp(0, 1, 2), 1); // Should clamp to max

  // Tests with large numbers
  equal(clamp(0, 1000000, 1000000), 1000000);
  equal(clamp(0, 1000000, 1000001), 1000000); // Should clamp to max
  equal(clamp(-1000000, 0, -1000001), -1000000); // Should clamp to min
});

challenge("prime", (wasm) => {
  const prime = expectFunc(wasm.instance.exports.prime);

  // Positive numbers
  equal(prime(0), 0);
  equal(prime(1), 0);
  equal(prime(2), 1);
  equal(prime(3), 1);
  equal(prime(4), 0);
  equal(prime(5), 1);
  equal(prime(6), 0);
  equal(prime(7), 1);
  equal(prime(8), 0);
  equal(prime(9), 0);
  equal(prime(10), 0);
  equal(prime(11), 1);
  equal(prime(12), 0);

  // Negative numbers
  equal(prime(-1), 0);
  equal(prime(-2), 1);
  equal(prime(-3), 1);
  equal(prime(-4), 0);
  equal(prime(-5), 1);
  equal(prime(-6), 0);
  equal(prime(-7), 1);
  equal(prime(-8), 0);
  equal(prime(-9), 0);
  equal(prime(-10), 0);
  equal(prime(-11), 1);
  equal(prime(-12), 0);

  // Larger primes
  equal(prime(6569), 1);
  equal(prime(6570), 0);
  equal(prime(6571), 1);
});

challenge("calculate", (wasm) => {
  const calculate = expectFunc(wasm.instance.exports.calculate);

  // Basic arithmetic operations
  equal(calculate(0x1, 5, 3), 8); // Addition (5 + 3)
  equal(calculate(0x2, 5, 3), 2); // Subtraction (5 - 3)
  equal(calculate(0x3, 5, 3), 15); // Multiplication (5 * 3)
  equal(calculate(0x4, 6, 3), 2); // Division (6 / 3)

  // Invalid operator should return 0
  equal(calculate(0x0, 5, 3), 0); // Invalid operator
  equal(calculate(0x5, 5, 3), 0); // Invalid operator

  // Edge cases with zero values
  equal(calculate(0x1, 0, 0), 0); // Addition (0 + 0)
  equal(calculate(0x2, 0, 0), 0); // Subtraction (0 - 0)
  equal(calculate(0x3, 0, 0), 0); // Multiplication (0 * 0)
  equal(calculate(0x4, 0, 1), 0); // Division (0 / 1)

  // Edge cases with negative values
  equal(calculate(0x1, -5, 3), -2); // Addition (-5 + 3)
  equal(calculate(0x2, -5, -3), -2); // Subtraction (-5 - (-3))
  equal(calculate(0x3, -5, 3), -15); // Multiplication (-5 * 3)
  equal(calculate(0x4, -6, 3), -2); // Division (-6 / 3)
});

// --- Bitwise Challenges ---

challenge("rgb_pack", (wasm) => {
  const pack = expectFunc(wasm.instance.exports.pack);

  // Basic color encoding
  equal(pack(0xff, 0x00, 0x00), 0xff0000); // Red
  equal(pack(0x00, 0xff, 0x00), 0x00ff00); // Green
  equal(pack(0x00, 0x00, 0xff), 0x0000ff); // Blue

  // Mixed colors
  equal(pack(0x12, 0x34, 0x56), 0x123456); // Custom color
  equal(pack(0xab, 0xcd, 0xef), 0xabcdef); // Custom color

  // White and Black
  equal(pack(0xff, 0xff, 0xff), 0xffffff); // White
  equal(pack(0x00, 0x00, 0x00), 0x000000); // Black

  // Edge case: Min and max values for each component
  equal(pack(0x00, 0x00, 0x00), 0x000000); // Min: black
  equal(pack(0xff, 0xff, 0xff), 0xffffff); // Max: white
  equal(pack(0xff, 0x00, 0xff), 0xff00ff); // Magenta
  equal(pack(0x00, 0xff, 0xff), 0x00ffff); // Cyan
  equal(pack(0xff, 0xff, 0x00), 0xffff00); // Yellow

  // Grayscale values
  equal(pack(0x55, 0x55, 0x55), 0x555555); // Dark gray
  equal(pack(0xaa, 0xaa, 0xaa), 0xaaaaaa); // Light gray

  // Custom random colors
  equal(pack(0x98, 0x76, 0x54), 0x987654); // Custom color
  equal(pack(0x12, 0x3a, 0xbc), 0x123abc); // Custom color
});

challenge("rgb_to_bgr", (wasm) => {
  const rgb2bgr = expectFunc(wasm.instance.exports.rgb2bgr);

  // Basic swizzle tests
  equal(rgb2bgr(hex(0xff0000)), hex(0x0000ff)); // Red becomes Blue
  equal(rgb2bgr(hex(0x00ff00)), hex(0x00ff00)); // Green stays the same
  equal(rgb2bgr(hex(0x0000ff)), hex(0xff0000)); // Blue becomes Red

  // Mixed colors
  equal(rgb2bgr(hex(0x123456)), hex(0x563412)); // Custom swizzle
  equal(rgb2bgr(hex(0xabcdef)), hex(0xefcdab)); // Custom swizzle

  // White and Black
  equal(rgb2bgr(hex(0xffffff)), hex(0xffffff)); // White stays the same
  equal(rgb2bgr(hex(0x000000)), hex(0x000000)); // Black stays the same

  // Edge cases
  equal(rgb2bgr(hex(0x0000ff)), hex(0xff0000)); // Blue to Red
  equal(rgb2bgr(hex(0xff00ff)), hex(0xff00ff)); // Magenta: Red and Blue swapped
  equal(rgb2bgr(hex(0x00ffff)), hex(0xffff00)); // Cyan: Blue to Red

  // Grayscale values
  equal(rgb2bgr(hex(0x555555)), hex(0x555555)); // Grayscale stays the same
  equal(rgb2bgr(hex(0xaaaaaa)), hex(0xaaaaaa)); // Grayscale stays the same

  // Swizzling with random color values
  equal(rgb2bgr(hex(0x987654)), hex(0x547698)); // Custom swizzle
  equal(rgb2bgr(hex(0x123abc)), hex(0xbc3a12)); // Custom swizzle
});

challenge("hamming_weight", (wasm) => {
  const hamming = expectFunc(wasm.instance.exports.hamming);

  // Basic cases with small numbers
  equal(hamming(0b0000), 0);
  equal(hamming(0b0001), 1);
  equal(hamming(0b0011), 2);
  equal(hamming(0b0111), 3);

  // Hamming weight for powers of two
  equal(hamming(0b00010), 1);
  equal(hamming(0b00100), 1);
  equal(hamming(0b01000), 1);
  equal(hamming(0b10000), 1);

  // Larger numbers
  equal(hamming(0b1111), 4);
  equal(hamming(0b11111111), 8);
  equal(hamming(0b100100011010001010110), 9);

  // Edge cases with negative numbers (two's complement representation)
  equal(hamming(-0b1), 32);
  equal(hamming(-0b10), 31);

  // Hamming weight for random values
  equal(hamming(0b101010111100110111101111), 17);
  equal(hamming(0b00010010001101000101011001111000), 13);
});

challenge("bitboard", (wasm) => {
  const lookup = expectFunc(wasm.instance.exports.lookup);

  // prettier-ignore
  const board = parseBitboard(
   // 0  1  2  3  4
      1, 0, 1, 1, 1, // 0
      0, 0, 0, 0, 0, // 1
      0, 0, 1, 0, 0, // 2
      0, 0, 0, 0, 0, // 3
      0, 0, 0, 0, 1, // 4
  );

  // Check out-of-bounds bits
  equal(lookup(board, -1, 0), -1);
  equal(lookup(board, 0, -1), -1);
  equal(lookup(board, 5, 0), -1);
  equal(lookup(board, 0, 5), -1);

  // Check up some in-bounds bits
  equal(lookup(board, 0, 0), 1);
  equal(lookup(board, 1, 0), 0);
  equal(lookup(board, 2, 0), 1);
  equal(lookup(board, 2, 2), 1);
  equal(lookup(board, 1, 2), 0);
  equal(lookup(board, 3, 2), 0);
  equal(lookup(board, 4, 4), 1);
});

challenge("xorshift32", (wasm) => {
  const xorshift32 = expectFunc(wasm.instance.exports.xorshift32);
  const seed = expectFunc(wasm.instance.exports.seed);
  const fmt = hex;

  seed(0x123456);
  equal(fmt(xorshift32()), fmt(-0x6a7dcba6));
  equal(fmt(xorshift32()), fmt(-0x4dd559e2));
  equal(fmt(xorshift32()), fmt(0x3bcbb82a));

  seed(0x123456);
  equal(fmt(xorshift32()), fmt(-0x6a7dcba6));
  equal(fmt(xorshift32()), fmt(-0x4dd559e2));
  equal(fmt(xorshift32()), fmt(0x3bcbb82a));

  seed(0xbad);
  equal(fmt(xorshift32()), fmt(0x2fc0c9f7));
  equal(fmt(xorshift32()), fmt(-0x16c79c78));
  equal(fmt(xorshift32()), fmt(0x4c6b34ac));
});

challenge("high_bit", (wasm) => {
  const high = expectFunc(wasm.instance.exports.high);

  // Zero has no 1 bits
  equal(high(0b0), 0);

  // Powers of two
  equal(high(0b1), 0b1);
  equal(high(0b10), 0b10);
  equal(high(0b100), 0b100);
  equal(high(0b1000), 0b1000);
  equal(high(0b10000), 0b10000);

  // Full values
  equal(high(0b1), 0b1);
  equal(high(0b11), 0b10);
  equal(high(0b111), 0b100);
  equal(high(0b1111), 0b1000);
  equal(high(0b11111), 0b10000);

  // One bit numbers
  equal(high(0b00), 0b0);
  equal(high(0b01), 0b1);

  // Two bit numbers
  equal(high(0b10), 0b10);
  equal(high(0b11), 0b10);

  // Three bit numbers
  equal(high(0b101), 0b100);
  equal(high(0b110), 0b100);
  equal(high(0b111), 0b100);

  // Four bit numbers
  equal(high(0b1000), 0b1000);
  equal(high(0b1001), 0b1000);
  equal(high(0b1010), 0b1000);
  equal(high(0b1011), 0b1000);
  equal(high(0b1100), 0b1000);
  equal(high(0b1101), 0b1000);
  equal(high(0b1110), 0b1000);
  equal(high(0b1111), 0b1000);

  // Larger numbers
  equal(high(0b10101010), 0b10000000);
  equal(high(0b101010101010), 0b100000000000);
});

// --- Geometry Challenges ---

challenge("taxicab_distance", (wasm) => {
  const taxicab = expectFunc(wasm.instance.exports.taxicab);

  // Basic tests with different x and y values
  equal(taxicab(0, 1, 2, 3), 4);
  equal(taxicab(1, 2, 4, 5), 6);

  // Same point, should return 0
  equal(taxicab(5, 6, 5, 6), 0);

  // Tests with negative coordinates and different x, y values
  equal(taxicab(-1, 3, 2, -2), 8);
  equal(taxicab(-3, 4, 5, -1), 13);

  // Mixed positive and negative coordinates with different values
  equal(taxicab(3, -7, -2, 8), 20);
  equal(taxicab(-6, 5, 2, -3), 16);

  // Larger coordinates with varied x and y
  equal(taxicab(1200, 500, 1800, 3000), 3100);
  equal(taxicab(-1000, -1500, 2000, 1000), 5500);

  // Edge cases with one axis being the same
  equal(taxicab(0, 100, 0, 300), 200);
  equal(taxicab(400, 0, 800, 0), 400);
});

challenge("euclidean_distance", (wasm) => {
  const euclidean = expectFunc(wasm.instance.exports.euclidean);
  const equal = equalClose;

  // Basic tests with different x and y values
  equal(euclidean(0.0, 1.0, 2.0, 3.0), 2.828427);
  equal(euclidean(1.0, 2.0, 4.0, 6.0), 5.0);

  // Same point, should return 0
  equal(euclidean(5.0, 6.0, 5.0, 6.0), 0.0);

  // Tests with negative coordinates
  equal(euclidean(-1.0, 3.0, 2.0, -2.0), 5.83);
  equal(euclidean(-3.0, 4.0, 5.0, -1.0), 9.433);

  // Mixed positive and negative coordinates
  equal(euclidean(3.0, -7.0, -2.0, 8.0), 15.811);
  equal(euclidean(-6.0, 5.0, 2.0, -3.0), 11.313);

  // Larger coordinates with varied x and y
  equal(euclidean(1200.0, 500.0, 1800.0, 3000.0), 2570.991);
  equal(euclidean(-1000.0, -1500.0, 2000.0, 1000.0), 3905.124);

  // Edge cases with one axis being the same
  equal(euclidean(0.0, 100.0, 0.0, 300.0), 200.0);
  equal(euclidean(400.0, 0.0, 800.0, 0.0), 400.0);
});

// --- Chess Challenges ---

challenge("chess_moves_rook", (wasm) => {
  const rook = expectFunc(wasm.instance.exports.rook);

  // Not moving is not legal
  equal(rook(0, 0, 0, 0), 0);

  // Basic valid rook moves
  equal(rook(0, 0, 0, 5), 1); // Move vertically
  equal(rook(0, 0, 5, 0), 1); // Move horizontally

  // Invalid moves (not along a row or column)
  equal(rook(0, 0, 5, 5), 0); // Diagonal move
  equal(rook(3, 2, 5, 4), 0); // Random non-straight move

  // Valid moves with negative coordinates (infinite board)
  equal(rook(-3, -3, -3, 10), 1); // Vertical move
  equal(rook(-4, -7, 4, -7), 1); // Horizontal move

  // Invalid moves with negative coordinates
  equal(rook(-5, -5, -3, -3), 0); // Diagonal move
  equal(rook(-8, -6, -1, -2), 0); // Random non-straight move

  // Moves along x-axis or y-axis with different values
  equal(rook(100, 50, 100, -50), 1); // Vertical move
  equal(rook(-20, -10, 20, -10), 1); // Horizontal move

  // Edge cases where only one axis changes
  equal(rook(1, 0, 1, 1000000), 1); // Large vertical move
  equal(rook(0, -1000000, 0, 1000000), 1); // Very large vertical move
});

challenge("chess_moves_bishop", (wasm) => {
  const bishop = expectFunc(wasm.instance.exports.bishop);

  // Valid diagonal moves
  equal(bishop(0, 0, 1, 1), 1); // Move one step diagonally
  equal(bishop(2, 3, 5, 6), 1); // Move three steps diagonally
  equal(bishop(3, 3, 6, 0), 1); // Move diagonally in the opposite direction

  // Same position, should return 0 (not moving is not a legal move)
  equal(bishop(4, 4, 4, 4), 0); // No movement

  // Invalid moves (not diagonal)
  equal(bishop(0, 0, 0, 5), 0); // Vertical move
  equal(bishop(1, 1, 3, 1), 0); // Horizontal move
  equal(bishop(2, 2, 3, 4), 0); // Random non-diagonal move

  // Valid moves with negative coordinates (diagonal)
  equal(bishop(-3, -3, -6, -6), 1); // Diagonal move with negative coordinates
  equal(bishop(-4, 4, -6, 6), 1); // Diagonal move with mixed coordinates

  // Invalid moves with negative coordinates (non-diagonal)
  equal(bishop(-5, -5, -5, -3), 0); // Vertical move
  equal(bishop(-1, -1, 1, 0), 0); // Invalid non-diagonal move

  // Larger moves (diagonal)
  equal(bishop(100, 200, 300, 400), 1); // Large diagonal move
  equal(bishop(-100, -200, -300, -400), 1); // Large diagonal move with negative coordinates

  // Invalid moves (not diagonal)
  equal(bishop(100, 200, 300, 201), 0); // Invalid move
  equal(bishop(50, 60, 60, 51), 0); // Invalid non-diagonal move
});

challenge("chess_moves_knight", (wasm) => {
  const knight = expectFunc(wasm.instance.exports.knight);

  // All valid moves from 0, 0
  equal(knight(0, 0, 1, -2), 1);
  equal(knight(0, 0, 2, -1), 1);
  equal(knight(0, 0, 2, 1), 1);
  equal(knight(0, 0, 1, 2), 1);
  equal(knight(0, 0, -1, 2), 1);
  equal(knight(0, 0, -2, 1), 1);
  equal(knight(0, 0, -2, -1), 1);
  equal(knight(0, 0, -1, -2), 1);

  // Not moving at all is not a legal move
  equal(knight(0, 0, 0, 0), 0);

  // Moving by two tiles is not legal either
  equal(knight(0, 0, 0, 2), 0);
  equal(knight(0, 0, 2, 2), 0);
  equal(knight(0, 0, 2, 0), 0);
  equal(knight(0, 0, 2, -2), 0);
  equal(knight(0, 0, 0, -2), 0);
  equal(knight(0, 0, -2, -2), 0);
  equal(knight(0, 0, -2, 0), 0);
  equal(knight(0, 0, -2, 2), 0);

  // Moving by three tiles is not legal either
  equal(knight(0, 0, 0, 3), 0);
  equal(knight(0, 0, 3, 3), 0);
  equal(knight(0, 0, 3, 0), 0);
  equal(knight(0, 0, 3, -3), 0);
  equal(knight(0, 0, 0, -3), 0);
  equal(knight(0, 0, -3, -3), 0);
  equal(knight(0, 0, -3, 0), 0);
  equal(knight(0, 0, -3, 3), 0);
});

challenge("chess_moves_pawn", (wasm) => {
  const pawn = expectFunc(wasm.instance.exports.pawn);

  // Basic valid pawn moves (single move forward)
  equal(pawn(0, 1, 0, 2), 1); // Single move forward from starting row
  equal(pawn(5, 3, 5, 4), 1); // Single move forward from non-starting row

  // Valid pawn double move from starting row
  equal(pawn(2, 1, 2, 3), 1); // Double move forward from starting row

  // Invalid pawn double move from non-starting row
  equal(pawn(2, 2, 2, 4), 0); // Double move not allowed from non-starting row

  // Invalid moves (not moving forward or moving sideways)
  equal(pawn(1, 1, 1, 0), 0); // Moving backwards
  equal(pawn(1, 1, 2, 2), 0); // Moving diagonally
  equal(pawn(1, 1, 2, 1), 0); // Moving sideways

  // Valid single moves from higher rows
  equal(pawn(3, 5, 3, 6), 1); // Single forward move
  equal(pawn(0, 10, 0, 11), 1); // Forward move from a far row

  // Invalid moves with negative coordinates
  equal(pawn(-1, 1, -1, 0), 0); // Moving backward (not allowed)
  equal(pawn(-3, 5, -3, 4), 0); // Moving backward from higher row

  // Valid moves on the starting row (double and single forward)
  equal(pawn(0, 1, 0, 3), 1); // Double move forward from starting row
  equal(pawn(0, 1, 0, 2), 1); // Single move forward from starting row

  // Invalid double move not on the starting row
  equal(pawn(0, 5, 0, 7), 0); // Double move not allowed from row 5

  // Moves along x-axis or y-axis
  equal(pawn(3, 1, 3, 2), 1); // Single move forward
  equal(pawn(3, 1, 3, 3), 1); // Double move forward from starting row

  // Edge case: invalid large moves
  equal(pawn(0, 1, 0, 4), 0); // Too large move
  equal(pawn(0, 5, 0, 9), 0); // Invalid large move from non-starting row
});

challenge("chess_moves_king", (wasm) => {
  const king = expectFunc(wasm.instance.exports.king);

  // All valid moves from 0, 0
  equal(king(0, 0, 0, 1), 1); // north
  equal(king(0, 0, 1, 1), 1); // north east
  equal(king(0, 0, 1, 0), 1); // east
  equal(king(0, 0, 1, -1), 1); // south east
  equal(king(0, 0, 0, -1), 1); // south
  equal(king(0, 0, -1, -1), 1); // south west
  equal(king(0, 0, -1, 0), 1); // west
  equal(king(0, 0, -1, 1), 1); // north west

  // Not moving at all is not a legal move
  equal(king(0, 0, 0, 0), 0);

  // Moving by two tiles is not legal either
  equal(king(0, 0, 0, 2), 0); // north
  equal(king(0, 0, 2, 2), 0); // north east
  equal(king(0, 0, 2, 0), 0); // east
  equal(king(0, 0, 2, -2), 0); // south east
  equal(king(0, 0, 0, -2), 0); // south
  equal(king(0, 0, -2, -2), 0); // south west
  equal(king(0, 0, -2, 0), 0); // west
  equal(king(0, 0, -2, 2), 0); // north west

  // Random moves
  equal(king(0, 0, 1, 1), 1);
  equal(king(0, 0, 2, 0), 0);
  equal(king(0, 0, 0, 2), 0);
  equal(king(5, 2, 0, 2), 0);
  equal(king(5, 1, 5, 2), 1);
  equal(king(3, 3, 2, 3), 1);
  equal(king(3, 3, 3, 2), 1);
});

challenge("chess_moves_queen", (wasm) => {
  const queen = expectFunc(wasm.instance.exports.queen);

  // Valid queen moves (horizontal, vertical, and diagonal)
  equal(queen(0, 0, 0, 5), 1); // Vertical move
  equal(queen(0, 0, 5, 0), 1); // Horizontal move
  equal(queen(2, 2, 5, 5), 1); // Diagonal move
  equal(queen(4, 4, 1, 1), 1); // Diagonal move in the opposite direction

  // Same position, should return 0 (not moving is not a legal move)
  equal(queen(3, 3, 3, 3), 0); // No movement

  // Invalid moves (not along a straight line or diagonal)
  equal(queen(0, 0, 2, 3), 0); // Random non-straight, non-diagonal move
  equal(queen(1, 2, 4, 4), 0); // Invalid non-diagonal move

  // Valid moves with negative coordinates
  equal(queen(-3, -3, -3, 10), 1); // Vertical move
  equal(queen(-4, 4, 4, 4), 1); // Horizontal move
  equal(queen(-5, -5, -8, -8), 1); // Diagonal move with negative coordinates

  // Invalid moves with negative coordinates
  equal(queen(-3, -3, -2, -1), 0); // Non-straight, non-diagonal move

  // Larger moves (horizontal, vertical, and diagonal)
  equal(queen(100, 100, 100, 500), 1); // Vertical move
  equal(queen(-200, -300, 200, -300), 1); // Horizontal move
  equal(queen(100, 200, 300, 400), 1); // Large diagonal move

  // Invalid moves (not straight or diagonal)
  equal(queen(100, 200, 300, 201), 0); // Invalid move
  equal(queen(50, 60, 61, 62), 0); // Invalid non-diagonal move
});

// --- Memory Challenges ---

challenge("load_from_memory", (wasm) => {
  const load = expectFunc(wasm.instance.exports.load);
  const memory = expectMemory(wasm.instance.exports.memory);

  setMemoryInt32(memory, [11, 22, 33]);
  equal(load(0), 11);
  equal(load(1), 22);
  equal(load(2), 33);

  // Try loading a value outside what we explicitly set.
  equal(load(5), 0);
});

challenge("store_in_memory", (wasm) => {
  const store = expectFunc(wasm.instance.exports.store);
  const memory = expectMemory(wasm.instance.exports.memory);
  const view = new DataView(memory.buffer);
  store(0, 11);
  store(1, 22);
  store(2, 33);
  store(10, 100);
  equal(view.getInt32(0, true), 11);
  equal(view.getInt32(4, true), 22);
  equal(view.getInt32(8, true), 33);
  equal(view.getInt32(40, true), 100);
});

challenge("sum_i32", (wasm) => {
  const sum = expectFunc(wasm.instance.exports.sum);
  const memory = expectMemory(wasm.instance.exports.memory);

  // n = 0 edge case
  equal(sum(0), 0);

  // n < 0 edge cases
  equal(sum(-1), 0);
  equal(sum(-10), 0);

  // Sum of positive numbers
  setMemoryInt32(memory, [1, 2, 3, 4, 5, 6]);
  equal(sum(6), 21);

  // Sum of negative numbers
  setMemoryInt32(memory, [-4, -4, -4]);
  equal(sum(3), -12);

  // Sum of mixed numbers
  setMemoryInt32(memory, [-4, 4, -3, 3]);
  equal(sum(4), 0);
});

challenge("sum_u8", (wasm) => {
  const sum = expectFunc(wasm.instance.exports.sum);
  const memory = expectMemory(wasm.instance.exports.memory);

  // n = 0 edge case
  equal(sum(0), 0);

  // n < 0 edge cases
  equal(sum(-1), 0);
  equal(sum(-10), 0);

  setMemoryUint8(memory, [1, 2, 3, 4, 5, 6]);
  equal(sum(6), 21);
});

challenge("mean", (wasm) => {
  const mean = expectFunc(wasm.instance.exports.mean);
  const memory = expectMemory(wasm.instance.exports.memory);

  setMemoryFloat32(memory, [1, 2, 3, 4, 5, 6]);
  equal(mean(6), 3.5);

  setMemoryFloat32(memory, [5, 5, 5]);
  equal(mean(3), 5);

  setMemoryFloat32(memory, [5, 10, 15]);
  equal(mean(3), 10);

  setMemoryFloat32(memory, [0, 0, 0, 0]);
  equal(mean(4), 0);

  setMemoryFloat32(memory, [0, 0, 0, 10]);
  equal(mean(4), 2.5);

  equal(mean(0), 0); // zero is a bit of an edge case
});

challenge("counting", (wasm) => {
  const counting = expectFunc(wasm.instance.exports.counting);
  const memory = expectMemory(wasm.instance.exports.memory);

  // n = 0 edge case
  equal(counting(0, 10), 0);

  // n < 0 edge case
  equal(counting(-1, 10), 0);
  equal(counting(-10, 10), 0);

  // End value edge cases
  setMemoryInt32(memory, [0, 1, 2, 3, 4, 5]);
  equal(counting(6, -1), 0);
  equal(counting(6, 0), 1);
  equal(counting(6, 5), 1);
  equal(counting(6, 6), 0);
  resetMemory(memory);

  // Same value edge case
  setMemoryInt32(memory, [0, 0, 0, 0, 0]);
  equal(counting(5, 0), 5);
  equal(counting(5, 1), 0);
  resetMemory(memory);

  // Simple counting
  setMemoryInt32(memory, [1, 2, 2, 3, 3, 3, 4, 4, 4, 4]);
  equal(counting(10, 0), 0);
  equal(counting(10, 1), 1);
  equal(counting(10, 2), 2);
  equal(counting(10, 3), 3);
  equal(counting(10, 4), 4);
  resetMemory(memory);
});

// --- Poker Challenges ---

challenge("poker_rank_value", (wasm) => {
  const rank = expectFunc(wasm.instance.exports.rank);
  const memory = expectMemory(wasm.instance.exports.memory);

  // prettier-ignore
  setMemoryUint8(memory, [
    A, SPADES,
    2, CLUBS,
    3, HEARTS,
    4, DIAMONDS,
    5, SPADES,
  ]);

  equal(rank(0), A);
  equal(rank(1), 2);
  equal(rank(2), 3);
  equal(rank(3), 4);
  equal(rank(4), 5);
});

challenge("poker_suit_value", (wasm) => {
  const suit = expectFunc(wasm.instance.exports.suit);
  const memory = expectMemory(wasm.instance.exports.memory);

  // prettier-ignore
  setMemoryUint8(memory, [
    A, SPADES,
    2, CLUBS,
    3, HEARTS,
    4, DIAMONDS,
    5, SPADES,
  ]);

  equal(suit(0), SPADES);
  equal(suit(1), CLUBS);
  equal(suit(2), HEARTS);
  equal(suit(3), DIAMONDS);
  equal(suit(4), SPADES);
});

challenge("poker_high_card", (wasm) => {
  const high = expectFunc(wasm.instance.exports.high);
  const memory = expectMemory(wasm.instance.exports.memory);

  // Basic high card
  // prettier-ignore
  setMemoryUint8(memory, [2, CLUBS, 3, HEARTS, 4, DIAMONDS, 5, SPADES, 6, CLUBS]);
  equal(high(), 6);

  // Tied high card edge case
  // prettier-ignore
  setMemoryUint8(memory, [2, CLUBS, 3, HEARTS, 4, DIAMONDS, 10, SPADES, 10, CLUBS]);
  equal(high(), 10);

  // Ace high edge case
  // prettier-ignore
  setMemoryUint8(memory, [A, SPADES, 2, CLUBS, 3, HEARTS, 4, DIAMONDS, 5, SPADES]);
  equal(high(), A);

  // Ace beats King edge cases
  // prettier-ignore
  setMemoryUint8(memory, [A, SPADES, K, CLUBS, K, HEARTS, K, DIAMONDS, K, SPADES]);
  equal(high(), A);
  // prettier-ignore
  setMemoryUint8(memory, [K, SPADES, K, CLUBS, K, HEARTS, K, DIAMONDS, A, SPADES]);
  equal(high(), A);
});

todo("poker_pair", (wasm) => {});
todo("poker_flush", (wasm) => {});
todo("poker_straight", (wasm) => {});
todo("poker_full_house", (wasm) => {});

// --- String Challenges ---

challenge("vowel", (wasm) => {
  const vowel = expectFunc(wasm.instance.exports.vowel);
  const u8 = (char) => char.charCodeAt(0);

  equal(vowel(u8("a")), 1);
  equal(vowel(u8("e")), 1);
  equal(vowel(u8("i")), 1);
  equal(vowel(u8("o")), 1);
  equal(vowel(u8("u")), 1);

  equal(vowel(u8("A")), 1);
  equal(vowel(u8("E")), 1);
  equal(vowel(u8("I")), 1);
  equal(vowel(u8("O")), 1);
  equal(vowel(u8("U")), 1);

  equal(vowel(u8(" ")), 0);
  equal(vowel(u8("b")), 0);
  equal(vowel(u8("C")), 0);
  equal(vowel(u8("z")), 0);
  equal(vowel(u8("-")), 0);
  equal(vowel(u8("+")), 0);
});

challenge("strlen", (wasm) => {
  const strlen = expectFunc(wasm.instance.exports.strlen);
  const memory = expectMemory(wasm.instance.exports.memory);

  // Empty string edge case
  setMemoryStringAscii(memory, "");
  equal(strlen(), 0);

  // Single char strings
  setMemoryStringAscii(memory, "a");
  equal(strlen(), 1);
  setMemoryStringAscii(memory, "A");
  equal(strlen(), 1);

  // ASCII zero edge case
  setMemoryStringAscii(memory, "0");
  equal(strlen(), 1);

  // Basic strings
  setMemoryStringAscii(memory, "Hello");
  equal(strlen(), 5);

  setMemoryStringAscii(memory, "Hello world");
  equal(strlen(), 11);

  setMemoryStringAscii(memory, "strlen_ascii");
  equal(strlen(), 12);
});

challenge("strchr", (wasm) => {
  const strchr = expectFunc(wasm.instance.exports.strchr);
  const memory = expectMemory(wasm.instance.exports.memory);

  // Empty string edge case
  setMemoryStringAscii(memory, "");
  equal(strchr(ascii("a")), -1);

  // Char not present edge case
  setMemoryStringAscii(memory, "abcdefg");
  equal(strchr(ascii("z")), -1);

  // First char edge case
  setMemoryStringAscii(memory, "abcdefg");
  equal(strchr(ascii("a")), 0);

  // Last char edge case
  setMemoryStringAscii(memory, "abcdefg");
  equal(strchr(ascii("g")), 6);

  // Many matches
  setMemoryStringAscii(memory, "ababab");
  equal(strchr(ascii("b")), 1);
});

challenge("strcmp", (wasm) => {
  const strcmp = expectFunc(wasm.instance.exports.strcmp);
  const memory = expectMemory(wasm.instance.exports.memory);

  // Empty string edge case
  setMemoryStringAscii(memory, "");
  equal(strcmp(0, 0), 1);

  // Same pointer
  setMemoryStringAscii(memory, "hello");
  equal(strcmp(0, 0), 1);

  // Same strings
  setMemoryStringAscii(memory, "hello\0hello");
  equal(strcmp(0, 6), 1);

  // Different strings
  setMemoryStringAscii(memory, "abc\0xyz");
  equal(strcmp(0, 4), 0);

  // Different lengths
  setMemoryStringAscii(memory, "abcd\0abc");
  equal(strcmp(0, 5), 0);
  setMemoryStringAscii(memory, "abc\0abcd");
  equal(strcmp(0, 4), 0);

  // Different start character
  setMemoryStringAscii(memory, "abcd\0abcz");
  equal(strcmp(0, 5), 0);
  setMemoryStringAscii(memory, "abcdz\0abcd");
  equal(strcmp(0, 6), 0);

  // Different final character
  setMemoryStringAscii(memory, "abcd\0abcz");
  equal(strcmp(0, 5), 0);
  setMemoryStringAscii(memory, "abcdz\0abcd");
  equal(strcmp(0, 6), 0);

  // Numeric strings
  setMemoryStringAscii(memory, "123\x00123");
  equal(strcmp(0, 4), 1);
  setMemoryStringAscii(memory, "123\x00321");
  equal(strcmp(0, 4), 0);
  setMemoryStringAscii(memory, "123\x00213");
  equal(strcmp(0, 4), 0);
  setMemoryStringAscii(memory, "123\x00312");
  equal(strcmp(0, 4), 0);
});

challenge("uppercase", (wasm) => {
  const uppercase = expectFunc(wasm.instance.exports.uppercase);
  const memory = expectMemory(wasm.instance.exports.memory);

  /** @param {string} inputString */
  const test = (inputString) => {
    setMemoryStringAscii(memory, inputString);
    uppercase();
    return getMemoryStringAscii(memory);
  };

  // Fully lower case strings
  equal(test("abc"), "ABC");
  equal(test("hello world"), "HELLO WORLD");

  // Mixed case strings
  equal(test("Hello World"), "HELLO WORLD");
  equal(test("WASM Challenges"), "WASM CHALLENGES");

  // Upper case strings
  equal(test("UPPERCASE"), "UPPERCASE");
  equal(test("WASM"), "WASM");

  // Punctuation
  equal(test("Hello, world!"), "HELLO, WORLD!");
  equal(test("'Challenging?'"), "'CHALLENGING?'");
});

challenge("reverse_string", wasm => {
  const reverse = expectFunc(wasm.instance.exports.reverse);
  const memory = expectMemory(wasm.instance.exports.memory);

  /** @param {string} inputString */
  const test = (inputString) => {
    setMemoryStringAscii(memory, inputString);
    reverse();
    return getMemoryStringAscii(memory);
  };

  equal(test(""), ""); // Empty string
  equal(test("!"), "!"); // Single char
  equal(test("1234"), "4321"); // Even-length string
  equal(test("123"), "321"); // Odd-length string
  equal(test("Hello"), "olleH"); // Case sensitivity
  equal(test("reversed"), "desrever"); // Palindrome
  equal(test("racecar"), "racecar"); // Palindrome
  equal(test("redivider"), "redivider"); // Palindrome
});

challenge("strstr", (wasm) => {
  const strstr = expectFunc(wasm.instance.exports.strstr);
  const memory = expectMemory(wasm.instance.exports.memory);

  setMemoryStringAscii(memory, "abc\0a\0");
  equal(strstr(0, 4), 0);

  setMemoryStringAscii(memory, "abc\0b\0");
  equal(strstr(0, 4), 1);

  setMemoryStringAscii(memory, "abc\0c\0");
  equal(strstr(0, 4), 2);

  setMemoryStringAscii(memory, "abc\0d\0");
  equal(strstr(0, 4), -1);

  // Empty search string
  setMemoryStringAscii(memory, "abc");
  equal(strstr(0, 4), 0);

  // Empty string
  setMemoryStringAscii(memory, "\0abc\0");
  equal(strstr(0, 1), -1);

  // Case sensitive
  setMemoryStringAscii(memory, "hello\0LL\0");
  equal(strstr(0, 6), -1);

  // Same strings
  setMemoryStringAscii(memory, "wasm\0wasm\0");
  equal(strstr(0, 5), 0);

  // Search is a subset
  setMemoryStringAscii(memory, "wasm\0asm\0");
  equal(strstr(0, 5), 1);

  // Search is a superset
  setMemoryStringAscii(memory, "wasm\0wasmer\0");
  equal(strstr(0, 5), -1);

  // Finds first instance
  setMemoryStringAscii(memory, "wasm wasm wasm\0wasm\0");
  equal(strstr(0, 15), 0);
});

todo("bracket_matching", (wasm) => {
  const _matching = expectFunc(wasm.instance.exports.matching);
  const memory = expectMemory(wasm.instance.exports.memory);

  /** @param {string} string */
  const matching = (string) => {
    setMemoryStringAscii(memory, string);
    return _matching();
  };

  equal(matching(""), 1);
  equal(matching("[]"), 1);
  equal(matching("[abc]"), 1);
  equal(matching("a[b]c"), 1);
  equal(matching("a[]c"), 1);
  equal(matching("["), 0);
  equal(matching("]"), 0);
  equal(matching("a["), 0);
  equal(matching("a]"), 0);
  equal(matching("[c"), 0);
  equal(matching("]c"), 0);
  equal(matching("[c"), 0);
  equal(matching("]c["), 0);
  equal(matching("[[]"), 0);
  equal(matching("[]]"), 0);
  equal(matching("[[]]"), 1);
  equal(matching("[a[b]c]"), 1);
  equal(matching("[][][]"), 1);
  equal(matching("[][[]][]"), 1);
  equal(matching("[][][]["), 0);
});

challenge("parse_int", (wasm) => {
  const parse = expectFunc(wasm.instance.exports.parse);
  const memory = expectMemory(wasm.instance.exports.memory);

  setMemoryStringAscii(memory, "1");
  equal(parse(), 1);
  setMemoryStringAscii(memory, "123");
  equal(parse(), 123);
  setMemoryStringAscii(memory, "50000");
  equal(parse(), 50000);

  // Mixed with non-integer characters
  setMemoryStringAscii(memory, "a123b");
  equal(parse(), -1);
  setMemoryStringAscii(memory, "a123");
  equal(parse(), -1);
  setMemoryStringAscii(memory, "123b");
  equal(parse(), -1);
  setMemoryStringAscii(memory, " 123");
  equal(parse(), -1);

  // Leading zeros
  setMemoryStringAscii(memory, "000");
  equal(parse(), 0);
  setMemoryStringAscii(memory, "0001");
  equal(parse(), 1);
  setMemoryStringAscii(memory, "0001000");
  equal(parse(), 1000);

  // Negative values
  setMemoryStringAscii(memory, "-999");
  equal(parse(), -1);

  // Non-numeric characters
  setMemoryStringAscii(memory, "Nine");
  equal(parse(), -1);
});

challenge("parse_float", (wasm) => {
  const parse = expectFunc(wasm.instance.exports.parse);
  const memory = expectMemory(wasm.instance.exports.memory);

  // Basic floats
  setMemoryStringAscii(memory, "123.456");
  equalClose(parse(), 123.456);
  setMemoryStringAscii(memory, "3.21");
  equalClose(parse(), 3.21);
  setMemoryStringAscii(memory, "0.123");
  equalClose(parse(), 0.123);
  setMemoryStringAscii(memory, "9876.5432");
  equalClose(parse(), 9876.5432);

  // Negative numbers
  setMemoryStringAscii(memory, "-123.0");
  equalClose(parse(), -123.0);
  setMemoryStringAscii(memory, "-0.123");
  equalClose(parse(), -0.123);

  // Invalid shorthand
  setMemoryStringAscii(memory, ".123");
  equalClose(parse(), 0.123);
  setMemoryStringAscii(memory, "-.123");
  equalClose(parse(), -0.123);

  // Non-numeric strings
  setMemoryStringAscii(memory, "abc");
  equalClose(parse(), 0);
  setMemoryStringAscii(memory, "abc.def");
  equalClose(parse(), 0);
  setMemoryStringAscii(memory, "-abc.def");
  equalClose(parse(), 0);

  // Mixed numeric strings
  setMemoryStringAscii(memory, " 1.1");
  equalClose(parse(), 0);
  setMemoryStringAscii(memory, "1.1 ");
  equalClose(parse(), 0);
  setMemoryStringAscii(memory, "1.1a");
  equalClose(parse(), 0);
  setMemoryStringAscii(memory, "a1.1");
  equalClose(parse(), 0);
  setMemoryStringAscii(memory, "1x1.1");
  equalClose(parse(), 0);
});

challenge("int_to_string", (wasm) => {
  const intToString = expectFunc(wasm.instance.exports.toString);
  const memory = expectMemory(wasm.instance.exports.memory);

  intToString(0);
  equal(getMemoryStringAscii(memory), "0");
  resetMemory(memory);

  intToString(12345);
  equal(getMemoryStringAscii(memory), "12345");
  resetMemory(memory);

  intToString(777);
  equal(getMemoryStringAscii(memory), "777");
  resetMemory(memory);

  intToString(87658377);
  equal(getMemoryStringAscii(memory), "87658377");
  resetMemory(memory);

  intToString(-12345);
  equal(getMemoryStringAscii(memory), "-12345");
  resetMemory(memory);

  intToString(-87658377);
  equal(getMemoryStringAscii(memory), "-87658377");
  resetMemory(memory);
});

challenge("utf8_length", (wasm) => {
  const strlen = expectFunc(wasm.instance.exports.strlen);
  const memory = expectMemory(wasm.instance.exports.memory);

  // UTF-8 is compatible with ASCII strings
  setMemoryStringUtf8(memory, "");
  equal(strlen(), 0);
  setMemoryStringUtf8(memory, "abc");
  equal(strlen(), 3);
  setMemoryStringUtf8(memory, "Hello world");
  equal(strlen(), 11);

  // Greek (0370–03FF) in the 2-byte range
  setMemoryStringUtf8(memory, "λόγος"); // Greek
  equal(strlen(), 5);

  // Arabic (0600–06FF) in the 2-byte range
  setMemoryStringUtf8(memory, "كلمة"); // Arabic
  equal(strlen(), 4);

  // Sinhala (0D80–0DFF) in the 3-byte range
  setMemoryStringUtf8(memory, "වචනය");
  equal(strlen(), 4);

  // Hangul (AC00–D7AF) in the 3-byte range
  setMemoryStringUtf8(memory, "한글"); // Korean
  equal(strlen(), 2);

  // Runic (16A0–16FF) in the 3-byte range
  setMemoryStringUtf8(memory, "ᚢᚬᚱᛏ");
  equal(strlen(), 4);

  // Geometric shapes (25A0–25FF) in the 3-byte range
  setMemoryStringUtf8(memory, "■◐◤◉");
  equal(strlen(), 4);

  // Emoticons (1F600–1F64F) in the 4-byte range
  setMemoryStringUtf8(memory, "😱😱😱😱😱");
  equal(strlen(), 5);

  // Characters from mixed ranges
  setMemoryStringUtf8(memory, "Hello 🤴");
  equal(strlen(), 7);
  setMemoryStringUtf8(memory, "🂧 (7S)");
  equal(strlen(), 6);
});

challenge("pangrams", (wasm) => {
  const pangram = expectFunc(wasm.instance.exports.pangram);
  const memory = expectMemory(wasm.instance.exports.memory);

  setMemoryStringAscii(memory, "");
  equal(pangram(), 0);

  setMemoryStringAscii(memory, "ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  equal(pangram(), 1);

  setMemoryStringAscii(memory, "abcdefghijklmnopqrstuvwxyz");
  equal(pangram(), 1);

  setMemoryStringAscii(memory, "ABCDEFGHIJKLMnopqrstuvwxyz");
  equal(pangram(), 1);

  // Duplicate letters are fine
  setMemoryStringAscii(memory, "aabcdefghijklmnopqrstuvwxyz");
  equal(pangram(), 1);

  // Famous pangrams
  setMemoryStringAscii(memory, "Sphinx of black quartz, judge my vow.");
  equal(pangram(), 1);
  setMemoryStringAscii(memory, "Pack my box with five dozen liquor jugs.");
  equal(pangram(), 1);
  setMemoryStringAscii(memory, "The five boxing wizards jump quickly.");
  equal(pangram(), 1);

  // Non pangrams
  setMemoryStringAscii(memory, "THE WHOLE ALPHABET");
  equal(pangram(), 0);
  setMemoryStringAscii(memory, "a-z");
  equal(pangram(), 0);
});

challenge("ipv4_parser", (wasm) => {
  const parse = expectFunc(wasm.instance.exports.parse);
  const memory = expectMemory(wasm.instance.exports.memory);

  /**
   * @param {string} str
   * @param {number} expected
   */
  const test = (str, expected) => {
    setMemoryStringAscii(memory, str);
    const actual = u32(parse());
    equal(hex(actual), hex(expected));
  };

  test("0.0.0.0", 0x00000000);
  test("1.2.3.4", 0x01020304);
  test("10.20.30.40", 0x0a141e28);
  test("16.32.64.128", 0x10204080);
  test("100.100.100.100", 0x64646464);
  test("255.255.255.255", 0xffffffff);
  test("255.0.0.0", 0xff000000);
  test("0.255.0.0", 0x00ff0000);
  test("0.0.255.0", 0x0000ff00);
  test("0.0.0.255", 0x000000ff);

  test("", 0); // Can't parse empty strings
  test(".0.0.0", 0); // First octet is empty
  test("0..0.0", 0); // Second octet is empty
  test("0.0..0", 0); // Third octet is empty
  test("0.0.0.", 0); // Fourth octet is empty
  test("0.0.0", 0); // Not enough octets
  test("0.0.0.0.0", 0); // Too many octets
  test(" 0.0.0.0", 0); // Leading garbage
  test("0.0.0.0 ", 0); // Trailing garbage
  test("256.0.0.0", 0); // Octet value is too large
  test("0.300.0.0", 0); // Octet value is too large
  test("0.0.400.0", 0); // Octet value is too large
  test("0.0.0.999", 0); // Octet value is too large
  test("01.02.03.04", 0); // Leading zeros are not allowed
  test("01.2.3.4", 0); // Leading zeros are not allowed
  test("1.02.3.4", 0); // Leading zeros are not allowed
  test("1.2.03.4", 0); // Leading zeros are not allowed
  test("1.2.3.04", 0); // Leading zeros are not allowed
});

todo("run_length_encoding"); // Run-length encoding
todo("run_length_decoding"); // Run-length decoding

// --- Cryptography Challenges ---

challenge("djb2_hash", (wasm) => {
  const djb2 = expectFunc(wasm.instance.exports.djb2);
  const memory = expectMemory(wasm.instance.exports.memory);

  setMemoryStringAscii(memory, "");
  equal(djb2(), 5381);

  setMemoryStringAscii(memory, "hello");
  equal(djb2(), 261238937);

  setMemoryStringAscii(memory, "djb2");
  equal(djb2(), 2090186023);

  // Longer strings
  setMemoryStringAscii(memory, "The quick brown fox jumps over the lazy dog");
  equal(djb2(), 885799134);
});

challenge("rot13_cipher", (wasm) => {
  const rot13 = expectFunc(wasm.instance.exports.rot13);
  const memory = expectMemory(wasm.instance.exports.memory);

  /** @param {string} inputString */
  const test = (inputString) => {
    setMemoryStringAscii(memory, inputString);
    rot13();
    return getMemoryStringAscii(memory);
  };

  // Lower case string
  equal(test("lowercase"), "ybjrepnfr");

  // Upper case string
  equal(test("HCCREPNFR"), "UPPERCASE");

  // Mixed case strings
  equal(test("Mixed Case"), "Zvkrq Pnfr");

  // Non-alpha characters are unchanged
  equal(test("|--@--|"), "|--@--|");

  // Examples from wikipedia article
  equal(
    test("Why did the chicken cross the road?"),
    "Jul qvq gur puvpxra pebff gur ebnq?",
  );
  equal(test("To get to the other side!"), "Gb trg gb gur bgure fvqr!");
});

challenge("adler32_checksum", (wasm) => {
  const adler32 = expectFunc(wasm.instance.exports.adler32);
  const memory = expectMemory(wasm.instance.exports.memory);

  /** @param {string} inputString */
  const checksum = (inputString) => {
    setMemoryStringAscii(memory, inputString);
    return u32(adler32());
  };

  equal(checksum("Wikipedia"), 300286872); // Wikipedia example
  equal(checksum(""), 1); // Empty string
  equal(checksum("a"), 6422626); // Single character 'a'
  equal(checksum("Z"), 5963867); // Single character 'Z'
  equal(checksum("aaaaaa"), 133890631); // Repeating 'a' characters
  equal(checksum("ZZZZZZZZ"), 212861649); // Repeating 'Z' characters
  equal(checksum("1234567890"), 187433486); // Numbers in the string
  equal(checksum("abc123XYZ"), 238486216); // Alphanumeric mix
  equal(checksum("abcdefghijklmnopqrstuvwxyz"), 2424703776);
});

todo("substitution_cipher"); // Cipher with a custom alphabet

// --- Turtle Challenges ---

todo("turtle_movement"); // Interpreting turtle movement commands
todo("turtle_drawing"); // Interpreting turtle drawing commands
todo("multiple_turtles"); // Allowing multiple turtles in parallel

// --- Misc Challenges ---

todo("bump_allocator"); // Implement a simple bump allocator
todo("brainfuck"); // Brainfuck interpreter
todo("mode"); // Find the mode from a list of i32s
todo("median"); // Find the median from a list of i32s
todo("standard_deviation");

// --- Game Challenges ---

todo("battlebits"); // Battleships where each ship is a single bit
todo("guess_the_word"); // Simple hangman/wordle where
todo("life"); // Game of life using a 100x100 board in memory
