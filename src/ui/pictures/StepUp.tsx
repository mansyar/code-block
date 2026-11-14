import type { PictureProps } from './picture';
import { StepArrow } from './StepArrow';

/** A step up the path. */
export function StepUp({ className }: PictureProps) {
  return <StepArrow className={className} turn={0} />;
}
