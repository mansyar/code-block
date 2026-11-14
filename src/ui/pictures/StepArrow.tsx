import type { PictureProps } from './picture';

type StepArrowProps = PictureProps & {
  /** Degrees clockwise. The three step pictures differ only here. */
  readonly turn: 0 | 90 | 180;
};

/**
 * One arrow, drawn pointing up and rotated by the caller.
 *
 * Orientation is the meaning, so the three steps stay distinguishable in silhouette and nobody has
 * to read a colour to know which way it points (product guidelines: colour plus shape, never
 * colour alone).
 */
export function StepArrow({ className, turn }: StepArrowProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform={`rotate(${turn} 32 32)`} fill="#2b3140">
        <polygon points="32,6 50,26 14,26" />
        <rect x="26" y="26" width="12" height="32" rx="3" />
      </g>
    </svg>
  );
}
