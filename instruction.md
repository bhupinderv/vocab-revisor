# Vocab Revisor

An Angular application for learning vocabulary through spaced repetition. Currently configured for Dutch-to-English translation practice.

## What It Does

The app quizzes users on vocabulary word pairs loaded from a plain text file. It tracks incorrect answers and re-quizzes only the missed words in subsequent rounds, focusing practice on weak areas until all words are mastered.

## How It Works

1. Loads word pairs from `src/assets/vocab.txt` (format: `word = meaning`)
2. Presents words one at a time in random order
3. User types the translation and submits
4. Correct answers are marked and removed from the active list
5. Incorrect answers are collected and form the next round's quiz set
6. A modal between rounds shows progress and asks whether to continue or quit
7. Rounds repeat until all words are answered correctly
8. A final screen lists every word the user struggled with across all rounds

## Key Features

- Multi-round spaced repetition focused on missed words
- Case-insensitive answer matching
- Real-time feedback: checkmark for correct, correct answer shown on error
- Progress stats: success percentage, words remaining, error count per round
- Final summary of all problematic words for offline review

## Vocabulary File Format

Each line in `src/assets/vocab.txt` defines one word pair:

```
dutch_word = english_meaning
word_with_multiple_meanings = meaning1,meaning2
```

To change the language set, replace the contents of `vocab.txt` with new word pairs in the same format.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 20 (standalone components) |
| Language | TypeScript 5.9 |
| HTTP | Angular HttpClient |
| Reactivity | RxJS |
| Forms | Angular FormsModule (two-way binding) |
| SSR | Express + Angular SSR |
| Testing | Jasmine / Karma |

## Running the App

```bash
npm install
npm start        # development server at http://localhost:4200
npm run build    # production build
npm test         # unit tests
```
