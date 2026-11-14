import type { ComponentType } from 'react';
import type { GameKind, Lesson } from '../content/lesson';

export type GameProps = {
  readonly lesson: Lesson;
  readonly onComplete: () => void;
};

/**
 * Game kind → component. This is the single place a new game is added; the lesson screen resolves
 * through `findGame` and shows a not-built-yet state while a kind is unregistered.
 */
export const gameRegistry: Readonly<Partial<Record<GameKind, ComponentType<GameProps>>>> = {};

export function findGame(kind: GameKind): ComponentType<GameProps> | undefined {
  return gameRegistry[kind];
}
