# code-block

## Overview

code-block is an installable web app (PWA) that teaches coding concepts to a four-year-old
through short, play-first lessons on a Duolingo-style journey. Every lesson is a small game the
child can finish with taps alone, followed by a spoken explanation of the concept the game was
secretly teaching.

## Problem / Motivation

Every coding app for young children assumes the child can read, or type, or both. A
four-year-old can do neither. The ideas that actually matter at that age — order, repetition,
cause and effect, "if this then that" — are perfectly teachable without a single written word,
if the interface speaks instead of printing.

The motivation is personal: one child, one tablet, and a curriculum built for him rather than
for a classroom. The design question is therefore not "how do we onboard users" but "can he get
from the sofa to a finished lesson without an adult in the loop".

## Users

- **Primary: the four-year-old.** Pre-literate, taps before he reads, abandons anything that
  does not respond instantly, cannot recover from a dead end by himself.
- **Secondary: the parent.** Installs the app, sets the volume, may peek at progress. Not a user
  of the lesson flow and not required for it to work.

There is exactly one learner in v1. No accounts, no multi-profile, no sharing.

## Primary Flow

1. The child opens the installed app; a single journey map shows the lessons he has unlocked.
2. He taps the next node. That starts a lesson.
3. The lesson opens as a game with one goal, explained in one spoken sentence and shown as a
   picture. He plays by tapping, dragging or ordering large picture cards.
4. When he completes the goal, the game pauses and the narrator names the idea he just used —
   "you told it the order: first, then next" — with the picture still on screen.
5. He gets a star, the map advances, and the next node unlocks.

A lesson is 60–120 seconds. A session is one to three lessons. Nothing times out and nothing
can be lost.

## Scope

In scope for v1:

- Installable PWA with an offline app shell and precached audio.
- A journey map of ordered lesson nodes, with locked/unlocked/completed states.
- One playable game per lesson, driven entirely by taps and drags.
- A spoken concept explanation after each game, played from pre-rendered audio.
- Stars, streak and lesson position persisted on the device in `localStorage`.
- One language, one narrator voice, one child.

Out of scope for v1:

- Accounts, sign-in, cloud sync or any per-user server state.
- Typing, reading-based quizzes, or any exercise that requires literacy.
- Runtime text-to-speech: the app never calls a TTS model while running.
- A parent dashboard, analytics, notifications or sharing links.
- Multiple children, multiple languages, or a lesson editor.
- Multiplayer, realtime, or anything with presence.

## Success Metrics

- The child completes a whole lesson unaided, twice in a row, without an adult touching the
  tablet.
- Tap-to-sound latency under 300 ms from cached audio; no spinner ever appears during play.
- The app opens and plays with no network, after the first load.
- He returns to it without being asked — the only metric that really counts.

## Open Questions and Assumptions

- **Curriculum size** → assumed six concepts for v1: order/sequence, repeat/loop, cause and
  effect/event, if-then/condition, spotting the wrong step/debugging, and "a box that
  remembers"/variable — because each maps to one visual game a four-year-old can play with
  pictures, and six gives the journey map something to show.
- **Lesson shape** → assumed *game first, then the concept*, one game and one explanation per
  lesson, because that is the stated journey and it keeps a lesson inside two minutes.
- **Language and voice** → assumed English, one narrator voice for every lesson — because a
  second voice or language doubles the audio pipeline for no v1 benefit.
- **Device** → assumed a tablet in landscape, Safari on iPad and Chrome on Android, because
  that is what a four-year-old actually holds. Desktop is supported but not the target.
- **Literacy** → assumed the child reads nothing: every instruction is spoken and every action
  is shown as a picture. Text is decorative, never the only carrier of meaning.
- **Audio rendering** → assumed the narration is rendered once, outside the app, with
  Chatterbox and shipped as static files, because fixed lesson scripts make runtime TTS pure
  latency and cost. See `tech-stack.md`.
- **Hosting** → assumed Freebuff Sites, because it serves static assets plus a tiny Worker and
  is where the parent asked for it to live. Publishing to production is a separate decision.
- **Progress** → assumed device-local only, because it is one child on one tablet; syncing would
  add identity, a database and a server route for no benefit yet.
