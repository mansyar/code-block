import type { PictureProps } from '../ui/pictures/picture';

/**
 * Where a leg of the road ends: a flag on the last cell of that leg.
 *
 * It exists so the walk has a destination a child can see — without it the path is a row of empty
 * cells and "why keep tapping" has no answer on screen. A lesson written in two legs draws two of
 * them, which is how a stop halfway becomes a place rather than an ending. Deliberately not a `PictureId`: it is
 * scenery, never a card, so the picture registry still holds exactly the four things a lesson may
 * name.
 */
export function Goal({ className }: PictureProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22 58V8" stroke="#2b3140" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M22 10h26l-7 10 7 10H22z"
        fill="#e2668a"
        stroke="#2b3140"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
