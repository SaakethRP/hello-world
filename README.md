# LA Dodgers Home Game Win Tracker

A simple web application for tracking LA Dodgers home game wins at Dodger Stadium.

## Features

- **Win Counter**: A prominent display showing the total number of recorded home game wins.
- **Add Wins**: Click "Add Home Game Win" to log a new victory with the current date.
- **Recent Wins List**: View a scrollable list of all recorded wins with dates.
- **Reset**: Clear all recorded wins with a confirmation prompt.
- **Persistent Storage**: Wins are saved to `localStorage` so data persists across browser sessions.

## Project Structure

- `index.html` — Main page with the win counter, controls, and recent wins list.
- `styles.css` — Styling with a Dodger blue theme and responsive layout.
- `tracker.js` — `DodgersWinTracker` class handling win tracking logic, localStorage persistence, and UI updates.
- `images/` — Image assets.

## Usage

Open `index.html` in a browser. Use the "Add Home Game Win" button to record wins and the "Reset Counter" button to clear all data.
