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

### Props

| Prop | Default | What it does |
| --- | --- | --- |
| `defaultDarkMode` | from localStorage | Start in dark mode. |
| `demo` | `'off'` | `'seed'` lays out a scene; `'loop'` also runs the search on repeat until the visitor touches the grid. |
| `demoMaps` | `false` | With `demo="loop"`, cycle through the theme's generated maps (river, mountains, maze...) instead of one hand-placed scene. |
| `showPresets` | `false` | One-click maps under the grid. Picking one lays it out and runs the search. |
| `showLegend` | `false` | A colour key under the grid, including the theme's terrain and its cost. |
| `rows`, `columns` | `8`, `12` | Starting grid size. Visitors can still change it in Settings. |
| `headingLevel` | `1` | Heading level for the title, or `'none'` to leave it out. |
| `standalone` | `true` | Wrap the grid in `<main>`. Set `false` when embedding in a page with its own. |

```tsx
<AStarVisualizer demo="loop" demoMaps showPresets showLegend rows={11} columns={22} headingLevel="none" standalone={false} />
```

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
