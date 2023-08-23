/**
 * Safely shifts a 64-bit unsigned integer to the right.
 * Throws an error for negative shifts and returns 0 for shifts >= 64.
 *
 * @param value - The 64-bit unsigned integer to be shifted.
 * @param shift - The number of positions to shift to the right.
 * @returns The shifted value.
 */
export function u64SafeShr(value: u64, shift: i32): u64 {
  if (shift < 0) {
    throw new RangeError("Negative shift");
  }

  if (shift >= 64) {
    return 0;
  }

  return value >> shift;
}

/**
 * Safely shifts a 64-bit unsigned integer to the left.
 * Throws an error for negative shifts and returns 0 for shifts >= 64.
 *
 * @param value - The 64-bit unsigned integer to be shifted.
 * @param shift - The number of positions to shift to the left.
 * @returns The shifted value.
 */
export function u64SafeShl(value: u64, shift: i32): u64 {
  if (shift < 0) {
    throw new RangeError("Negative shift");
  }

  if (shift >= 64) {
    return 0;
  }

  return value << shift;
}
