import type { PictureProps } from './picture';

/**
 * The walker: one actor for every lesson in the curriculum, so the concept is the only new thing
 * on screen when the child reaches a node.
 *
 * Drawn with a face and two feet so it reads as a creature to follow rather than a token to move,
 * and it carries no name — a name would be text, and text carries no meaning for this user.
 */
export function Walker({ className }: PictureProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="27" r="18" fill="#f6c445" stroke="#2b3140" strokeWidth="3" />
      <circle cx="26" cy="24" r="3" fill="#1c2130" />
      <circle cx="38" cy="24" r="3" fill="#1c2130" />
      <path
        d="M26 33q6 6 12 0"
        fill="none"
        stroke="#1c2130"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect
        x="13"
        y="44"
        width="15"
        height="10"
        rx="4"
        fill="#e2668a"
        stroke="#2b3140"
        strokeWidth="3"
      />
      <rect
        x="36"
        y="44"
        width="15"
        height="10"
        rx="4"
        fill="#e2668a"
        stroke="#2b3140"
        strokeWidth="3"
      />
    </svg>
  );
}
