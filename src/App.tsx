import { useReducer, useState } from 'react';
import { initialScreen, screenReducer } from './app/screen';
import { curriculum, findLesson, firstLesson } from './content/lessons/index';
import { JourneyMap } from './journey/JourneyMap';
import { LessonScreen } from './lesson/LessonScreen';
import { freshProgress } from './progress/schema';

/**
 * The shell: it owns the screen state and the progress value, and nothing else.
 * Progress is in memory for now; phase 5 swaps it for the persisted store.
 */
export function App() {
  const [screen, dispatch] = useReducer(screenReducer, initialScreen);
  const [progress] = useState(() => freshProgress(firstLesson.id));

  const close = () => dispatch({ type: 'closeLesson' });

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

    return <LessonScreen lesson={lesson} onClose={close} onComplete={close} />;
  }

  return (
    <JourneyMap
      curriculum={curriculum}
      progress={progress}
      onOpen={(lessonId) => dispatch({ type: 'openLesson', lessonId })}
    />
  );
}
