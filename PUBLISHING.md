# Publishing Guide

## Prerequisites

1. Create an npm account at https://www.npmjs.com/signup
2. Login to npm from your terminal:
   ```bash
   npm login
   ```

## Before Publishing

1. Update the package name in `package.json` if "astar-visualizer" is taken:
   ```json
   "name": "@your-username/astar-visualizer"
   ```

2. Add your repository URL in `package.json`:
   ```json
   "repository": {
     "type": "git",
     "url": "https://github.com/your-username/your-repo"
   }
   ```

3. Add your author info in `package.json`:
   ```json
   "author": "Your Name <your.email@example.com>"
   ```

## Publishing Steps

1. Build the library:
   ```bash
   npm run build:lib
   ```

2. Test the package locally (optional):
   ```bash
   npm pack
   ```
   This creates a `.tgz` file you can install in another project to test.

3. Publish to npm:
   ```bash
   npm publish
   ```

   If using a scoped package (@your-username/package-name), use:
   ```bash
   npm publish --access public
   ```

## Updating the Package

1. Update the version in `package.json`:
   - Patch: `1.0.0` → `1.0.1` (bug fixes)
   - Minor: `1.0.0` → `1.1.0` (new features)
   - Major: `1.0.0` → `2.0.0` (breaking changes)

   Or use npm version:
   ```bash
   npm version patch  # or minor, or major
   ```

2. Rebuild and publish:
   ```bash
   npm run build:lib
   npm publish
   ```

## Verify Publication

After publishing, check your package at:
```
https://www.npmjs.com/package/astar-visualizer
```

## Testing the Published Package

In a new React project:
```bash
npm install astar-visualizer
```

Then use it:
```tsx
import { AStarVisualizer } from 'astar-visualizer';
import 'astar-visualizer/style.css';

function App() {
  return <AStarVisualizer />;
}
```
