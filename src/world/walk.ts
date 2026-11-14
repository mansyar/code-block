/**
 * The shared answers about walking, so both games agree without either of them owning the numbers.
 */

/** How long one cell of the walk takes. Slow enough to follow, short enough to feel like a reply. */
export const STEP_MS = 350;

/**
 * How long the flag he just reached waves before the next leg opens.
 *
 * Reaching a flag is a beat, not an ending (FR-7). Without it the plan vanishes and the palette
 * comes back on the same frame, and the child never sees that the flag is what stopped him. Short
 * enough to read as an acknowledgement rather than a wait.
 */
export const FLAG_BEAT_MS = 400;

/**
 * How long the arrival is celebrated before the screen changes.
 *
 * He has just walked a road he worked out; cutting to the next screen on the same frame throws that
 * away. Long enough to see the arrival, short enough that it never feels like waiting.
 */
export const CELEBRATE_MS = 900;
