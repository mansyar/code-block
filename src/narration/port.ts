import type { ScriptLine } from '../content/lesson';

/**
 * The narration port. Everything that speaks goes through this interface, so the app has exactly
 * one place that knows how a line becomes sound (plan D1, D2).
 */
export type Narration = {
  /** Speak one line. Any line already speaking is cancelled first (plan D3). */
  readonly speak: (line: ScriptLine) => void;
  /** Stop whatever is speaking. */
  readonly stop: () => void;
};
