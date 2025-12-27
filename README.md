
# ♟️ ShellChess Professional

A high-performance, developer-focused Chess application built with React, Tailwind, and a custom Minimax AI engine. Designed to provide a "shell-like" experience for advanced users.

## 🚀 Key Features

- **Full Rule Compliance**: Powered by `chess.js`, supporting all legal moves, checkmate detection, stalemates, castling, and en passant.
- **AI Engine**: Proprietary Minimax implementation with Alpha-Beta pruning.
- **Multiple Difficulties**: From level 1 (Random) to level 4 (Advanced Depth).
- **Terminal UI**: Live log streaming of move notations and engine status.
- **Responsive Design**: Elegant adaptive layout for desktop and mobile.
- **Developer Tools**: Integrated Makefile for environment management.

## 🛠 How to Run

Since this is a React-based application:
1. Ensure you have a browser that supports ESM.
2. The application entry point is `index.html`.
3. Use `make run` to simulate the environment startup.

## ⌨️ Controls

- **Mouse/Touch**: Select a piece to see legal moves, then click a target square to move.
- **Sidebar**:
  - `UNDO`: Reverts the last full turn (your move + AI move).
  - `RESET`: Clears the board to starting position.
  - `LEVEL`: Select engine depth.
  - `PLAY WHITE/BLACK`: Switch your side of the board.

## 🏗 Project Structure

- `logic/`: AI and engine calculation modules.
- `components/`: Pure React UI components (Board, Pieces, Sidebar).
- `Makefile`: Command-line interface for the project.
- `types.ts`: Centralized TypeScript definitions.

---
*Created by a world-class senior engineer.*
