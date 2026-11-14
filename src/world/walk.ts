/**
 * The shared answers about walking, so both games agree without either of them owning the numbers.
 */

/** How long one cell of the walk takes. Slow enough to follow, short enough to feel like a reply. */
export const STEP_MS = 350;

/**
 * How long the arrival is celebrated before the screen changes.
 *
 * He has just walked a road he worked out; cutting to the next screen on the same frame throws that
 * away. Long enough to see the arrival, short enough that it never feels like waiting.
 */
export const CELEBRATE_MS = 900;
