import type { PictureProps } from './picture';

/**
 * The top slice: a domed crust over a flat base, so "put the lid on" reads as a different shape
 * from the plain slice.
 */
export function TopSlice({ className }: PictureProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 32a24 18 0 0 1 48 0v12a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4Z"
        fill="#e8c48a"
        stroke="#2b3140"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M8 32h48" stroke="#2b3140" strokeWidth="3" />
      <path
        d="M18 26c4-8 24-8 28 0"
        fill="none"
        stroke="#c9a06a"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
