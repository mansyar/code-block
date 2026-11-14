/**
 * Which screen is showing, and the only transitions that change it (plan D6).
 * No URL routing: the back control is a UI button, and state lives in this reducer.
 */
export type Screen =
  | { readonly kind: 'map' }
  | { readonly kind: 'lesson'; readonly lessonId: string };

export type ScreenAction =
  | { readonly type: 'openLesson'; readonly lessonId: string }
  | { readonly type: 'closeLesson' };

export const initialScreen: Screen = { kind: 'map' };

export function screenReducer(screen: Screen, action: ScreenAction): Screen {
  switch (action.type) {
    case 'openLesson':
      return { kind: 'lesson', lessonId: action.lessonId };
    case 'closeLesson':
      return initialScreen;
    default:
      return screen;
  }
}
