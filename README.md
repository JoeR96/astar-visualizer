# A* Pathfinding Visualizer

A React component for visualizing the A* pathfinding algorithm with an interactive grid interface.

## Installation

```bash
npm install astar-visualizer
```

## Usage

```tsx
import { AStarVisualizer } from 'astar-visualizer';

function App() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <AStarVisualizer />
    </div>
  );
}

export default App;
```

**Important:** The component requires a container with a defined height (e.g., `height: 100vh` or a fixed pixel height). The grid will automatically scale to fit within the available space.

## Features

- Interactive grid for setting start/end points and obstacles
- Real-time visualization of the A* algorithm
- Customizable grid size
- Control panel for algorithm execution
- Smooth animations with Framer Motion

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build library for publishing
npm run build:lib

# Run tests
npm test
```

## License

MIT
