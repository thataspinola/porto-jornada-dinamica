/**
 * Clamps a number so it always stays within the provided range.
 *
 * @param value - The number to constrain.
 * @param min - The minimum allowed value.
 * @param max - The maximum allowed value.
 * @returns The original value when it is in range, otherwise the nearest boundary.
 */
export const clampNumber = (
  value: number,
  min: number,
  max: number
): number => {
  return Math.min(max, Math.max(min, value))
}
