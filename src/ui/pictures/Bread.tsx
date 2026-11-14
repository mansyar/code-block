import type { PictureProps } from './picture';

/** A slice of bread: rounded crust, pale crumb. Distinct silhouette from the cheese triangle. */
export function Bread({ className }: PictureProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="8"
        y="16"
        width="48"
        height="36"
        rx="12"
        fill="#e8c48a"
        stroke="#2b3140"
        strokeWidth="3"
      />
      <rect x="16" y="25" width="32" height="19" rx="6" fill="#f8e7c2" />
    </svg>
  );
}
