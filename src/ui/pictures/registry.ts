import type { ComponentType } from 'react';
import type { PictureId } from '../../content/lesson';
import { Bread } from './Bread';
import { Cheese } from './Cheese';
import type { PictureProps } from './picture';
import { TopSlice } from './TopSlice';

/**
 * Picture id → component. A `Record` keyed by `PictureId`, so adding a picture to the content
 * contract without drawing it is a type error rather than a blank card.
 */
export const pictureRegistry: Readonly<Record<PictureId, ComponentType<PictureProps>>> = {
  bread: Bread,
  cheese: Cheese,
  top: TopSlice,
};

export function findPicture(id: PictureId): ComponentType<PictureProps> {
  return pictureRegistry[id];
}
