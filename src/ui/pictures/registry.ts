import type { ComponentType } from 'react';
import type { PictureId } from '../../content/lesson';
import type { PictureProps } from './picture';
import { StepDown } from './StepDown';
import { StepRight } from './StepRight';
import { StepUp } from './StepUp';
import { Walker } from './Walker';

/**
 * Picture id → component. A `Record` keyed by `PictureId`, so adding a sprite to the content
 * contract without drawing it is a type error rather than a blank card.
 */
export const pictureRegistry: Readonly<Record<PictureId, ComponentType<PictureProps>>> = {
  walker: Walker,
  'step-up': StepUp,
  'step-right': StepRight,
  'step-down': StepDown,
};

export function findPicture(id: PictureId): ComponentType<PictureProps> {
  return pictureRegistry[id];
}
