import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * Without globals, React Testing Library cannot register its own cleanup, so every test file
 * would accumulate the previous test's DOM and role queries would match duplicates.
 */
afterEach(() => {
  cleanup();
});
