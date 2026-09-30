import { Layout } from './layout/Layout.tsx';
import type { DemoMode } from './demo/useDemoMode.ts';

export interface AStarVisualizerProps {
  defaultDarkMode?: boolean;
  /**
   * Unattended behaviour when nothing has been drawn yet.
   *
   * - `'off'` (default) keeps the historic behaviour: an empty grid.
   * - `'seed'` lays out a start, a goal and walls so the grid is never blank.
   * - `'loop'` also runs the search on repeat until the visitor interacts.
   *   It waits between runs while the component is scrolled out of view.
   *
   * `true` is accepted as a shorthand for `'loop'`.
   */
  demo?: DemoMode | boolean;
  /** Render a colour key for the cell states beneath the grid. */
  showLegend?: boolean;
  /**
   * Heading level for the component's title, as a number or `'none'` to omit
   * the heading entirely. Defaults to `1`.
   *
   * Embedding the visualizer in a page that already has an `<h1>` otherwise
   * leaves that page with two, which breaks its heading outline.
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 'none';
  /**
   * Render the title and grid without the surrounding `<main>` landmark. Use
   * this when embedding inside a page that has its own `<main>`.
   */
  standalone?: boolean;
}

function App({
  defaultDarkMode,
  demo = 'off',
  showLegend = false,
  headingLevel = 1,
  standalone = true,
}: AStarVisualizerProps) {
  return (
    <Layout
      defaultDarkMode={defaultDarkMode}
      demo={demo === true ? 'loop' : demo === false ? 'off' : demo}
      showLegend={showLegend}
      headingLevel={headingLevel}
      standalone={standalone}
    />
  );
}

export default App;
