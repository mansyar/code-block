import type { PictureProps } from './picture';
import { StepArrow } from './StepArrow';

/** A step down the path. */
export function StepDown({ className }: PictureProps) {
  return <StepArrow className={className} turn={180} />;
}
