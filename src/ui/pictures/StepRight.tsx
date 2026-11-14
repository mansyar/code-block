import type { PictureProps } from './picture';
import { StepArrow } from './StepArrow';

/** A step across the path. */
export function StepRight({ className }: PictureProps) {
  return <StepArrow className={className} turn={90} />;
}
