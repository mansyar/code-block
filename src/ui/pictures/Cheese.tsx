import type { PictureProps } from './picture';

/** A triangle of cheese with holes — a silhouette no other card shares. */
export function Cheese({ className }: PictureProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 48 56 48 32 12Z"
        fill="#f6c445"
        stroke="#2b3140"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="30" cy="37" r="3.5" fill="#c98d0b" />
      <circle cx="39" cy="43" r="2.5" fill="#c98d0b" />
      <circle cx="23" cy="43" r="2" fill="#c98d0b" />
    </svg>
  );
}
