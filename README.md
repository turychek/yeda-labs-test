# Video Player

A custom video player built with React, supporting HLS streaming, chapters, and quality selection.

## Features

- Custom video player built from scratch (no third-party players).
- HLS streaming support with quality selection (720p, 1080p, etc.) using hls.js.
- Chapter display on the timeline with hover tooltips.
- Timeline interaction:
  - Hover to see current time and chapter name.
  - Click to seek to the selected time.

## Setup & Run Instructions

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm start
   ```

   The app will open in your browser at [http://localhost:3000](http://localhost:3000).

4. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/
│   ├── Player/         # Main video player component
│   ├── Tooltip/        # Tooltip for chapter display
│   └── Settings/       # Quality selection component
├── assets/             # Icons and other assets
└── styles/             # Global styles and variables
```

## Key Decisions & Challenges

- **HLS.js**: Used for HLS streaming and quality selection.
- **Custom Timeline**: Built from scratch to support chapters and hover tooltips.
- **Modular SCSS**: Used for styling to keep the code clean and maintainable.

## License

MIT
