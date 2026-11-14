import styles from './GoPad.module.css';

type GoPadProps = {
  readonly disabled: boolean;
  /** A run is in flight: the pad says so rather than inviting a second press. */
  readonly running: boolean;
  /** The last run stopped short of the flag, so the plan needs a look. */
  readonly stuck: boolean;
  readonly onPress: () => void;
};

/**
 * GO: the one control that turns a plan into movement (D6).
 *
 * Deliberately not a `PictureId`. The palette holds pictures a lesson may name, and this is a
 * control, so it borrows no sprite and every future lesson can use the same pad. It carries no
 * visible text — a child who cannot read must still be able to find it by shape, and its accessible
 * name is there for the grown-up and the screen reader, not printed on screen (FR-11).
 */
export function GoPad({ disabled, running, stuck, onPress }: GoPadProps) {
  return (
    <button
      type="button"
      className={styles.go}
      data-running={running ? 'true' : 'false'}
      data-stuck={stuck ? 'true' : 'false'}
      disabled={disabled}
      aria-label="Go"
      onClick={onPress}
    >
      <svg className={styles.mark} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <path d="M16 9 40 24 16 39Z" fill="currentColor" />
      </svg>
    </button>
  );
}
