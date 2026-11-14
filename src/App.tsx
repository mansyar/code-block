import { useReducer, useState } from 'react';
import { initialScreen, screenReducer } from './app/screen';
import { curriculum, findLesson } from './content/lessons/index';
import { JourneyMap } from './journey/JourneyMap';
import { LessonScreen } from './lesson/LessonScreen';
import type { Progress } from './progress/schema';
import { createStore, type ProgressStore } from './progress/store';

type AppProps = {
  /** Supplied by tests; the app builds its own store from the device storage. */
  readonly store?: ProgressStore;
};

/**
 * The shell: it owns the screen, the store and the progress value, and nothing else.
 *
 * Progress is read once from the store and written back the moment a lesson's game is finished, so
 * the star and the newly opened stop survive a reload (FR-6) and are on the map whichever way the
 * child leaves the lesson (FR-7). Leaving is the screen reducer's job, not this one's.
 */
export function App({ store }: AppProps = {}) {
  const [progressStore] = useState<ProgressStore>(() => store ?? createStore());
  const [progress, setProgress] = useState<Progress>(() => progressStore.load());
  const [screen, dispatch] = useReducer(screenReducer, initialScreen);

  const close = () => dispatch({ type: 'closeLesson' });

  const record = (lessonId: string) => {
    setProgress(progressStore.completeLesson(lessonId));
  };

  if (screen.kind === 'lesson') {
    const lesson = findLesson(screen.lessonId);

    if (lesson === undefined) {
      return (
        <main>
          <h1>Coming soon</h1>
          <p>This lesson is not built yet.</p>
          <button type="button" onClick={close}>
            Back to the path
          </button>
        </main>
      );
    }

    return <LessonScreen lesson={lesson} onClose={close} onComplete={() => record(lesson.id)} />;
  }

  return (
    <JourneyMap
      curriculum={curriculum}
      progress={progress}
      onOpen={(lessonId) => dispatch({ type: 'openLesson', lessonId })}
    />
  );
}
