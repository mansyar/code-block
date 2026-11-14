import type { ComponentType } from 'react';
import type { GameKind, Lesson } from '../content/lesson';
import { RepeatGame } from './repeat/RepeatGame';
import { SequenceGame } from './sequence/SequenceGame';

export type GameProps = {
  readonly lesson: Lesson;
  readonly onComplete: () => void;
  /** True while the screen is holding on the arrival, so the road can celebrate it. */
  readonly celebrating?: boolean | undefined;
};

/**
 * Game kind → component. This is the single place a new game is added; the lesson screen resolves
 * through `findGame` and shows a not-built-yet state while a kind is unregistered.
 */
export const gameRegistry: Readonly<Partial<Record<GameKind, ComponentType<GameProps>>>> = {
  sequence: SequenceGame,
  repeat: RepeatGame,
};

export function findGame(kind: GameKind): ComponentType<GameProps> | undefined {
  return gameRegistry[kind];
}
