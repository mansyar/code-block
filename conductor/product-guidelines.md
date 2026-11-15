# Product Guidelines

The user cannot read and will not wait. Every rule below exists to protect those two facts.

## The child is the interface

- **No text carries meaning.** An instruction that only exists as words is a bug. Words may
  appear as decoration next to a picture, never as the only way to know what to do.
- **One decision per screen.** One goal, one obvious next tap. If a screen has two plausible
  targets of equal weight, it has one too many.
- **Immediate feedback, always.** Every tap produces a visual and a sound within 100 ms. A tap
  that does nothing is indistinguishable from a broken app. That includes a tap the plan cannot
  take: the arrow that was pressed answers by itself, outlined for a beat.
- **No dead ends.** A wrong tap must be recoverable by tapping again. There is no "lose",
  no timer, no score that can go down, and no way to fail out of a lesson.
- **Forgiving hit areas.** Interactive targets are at least 72×72 CSS px with at least 16 px
  between them. A four-year-old's aim is imprecise and his drags overshoot.
- **Drag is optional.** Any drag interaction has a tap-only equivalent, because dragging is
  still motor-skill work at four.

## Narrator voice

- **Short sentences, present tense, second person.** "Tap the star." Not "the star should now
  be tapped by you".
- **Name the idea after the play, never before.** The concept is the payoff, not the brief.
- **Concrete nouns only.** Order, next, again, wait, stop, if, then — no abstractions such as
  "algorithm", "variable" or "function" in the spoken script. Those words are for the parent.
- **One idea per sentence, two sentences per explanation.** Anything longer is cut, not sped up.
- **Celebrate effort, not talent.** "You did it" rather than "you're so clever".
- **Never scold.** A wrong tap gets a gentle sound and a nudge, never a buzzer or a sad face.

## Visual language

- **The road is one drawn line.** A single band runs from the start pad, through every tile of the
  route, to the flag, and the pictures sit on top of it. Where it runs he may go; where it stops he
  may not. Never dots in the gaps between tiles, never dashes: its shape is the instruction.
- **A tile that repeats a step is a raised diamond.** Where the road takes an arrow twice, the tile
  wears a red diamond, so the rule is carried by shape as well as hue and a child who cannot tell red
  from green still reads which tile is different. It is never a control and never a word.
- **Large, high-contrast shapes.** Chunky rounded corners, thick outlines, flat fills. No thin
  hairlines, no gradients behind content, no transparency where a child must read a state.
- **Colour plus shape, never colour alone.** Locked, unlocked and completed nodes differ in
  silhouette as well as hue, so red-green colour blindness cannot erase a state.
- **Calm motion.** Motion confirms a tap; it does not perform. No parallax, no bouncing
  backgrounds, no confetti storms.
- **Two screens of chrome, maximum.** The map and the lesson. A settings screen exists only
  behind a parental gate.
- **Nothing to break.** No external links, no ads, no chat, no in-app purchase, no share sheet a
  child could wander into.

## Accessibility

- Contrast at least 4.5:1 for text and 3:1 for state-bearing shapes.
- Respect `prefers-reduced-motion`: replace movement with an opacity or colour change.
- Audio never the sole carrier of a state change — the visual changes too, so a muted tablet
  still works. A muted first run must not be a dead end.
- Support system text scaling up to 200% without clipping.
- Works with sound off: the game is playable silently, the explanation is skippable and can be
  replayed.
- Landscape and portrait both usable; nothing is pinned to a fixed pixel height.

## Session manners

- A lesson is 60–120 seconds; a session should not push past five minutes.
- Pausing is free: leaving mid-lesson and returning resumes the same lesson, not the map.
- A streak is encouraging, never punitive. A missed day resets the count but never locks
  content the child has already unlocked.
- Never autoplay narration over a game the child is already playing.

## Performance and offline

- The app shell and the current lesson's audio are precached; the map works fully offline.
- Total precached audio stays small enough that the first install is quick on a home connection
  (target: under 10 MB for the v1 curriculum).
- No network request is on the path of a tap.
