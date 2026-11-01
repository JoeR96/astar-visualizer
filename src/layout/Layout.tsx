import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Grid } from '../grid/Grid.tsx';
import { Toolbar } from '../toolbar/Toolbar.tsx';
import { StatsPanel } from '../statistics/StatsPanel.tsx';
import { SettingsPanel } from '../settings/SettingsPanel.tsx';
import { Legend } from '../legend/Legend.tsx';
import { useControlsBoundedStore } from '../BoundedStore.ts';
import { useDemoMode, DemoMode } from '../demo/useDemoMode.ts';
import { PresetBar } from '../presets/PresetBar.tsx';

export interface LayoutProps {
  defaultDarkMode?: boolean;
  demo?: DemoMode;
  showLegend?: boolean;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 'none';
  standalone?: boolean;
  rows?: number;
  columns?: number;
  showPresets?: boolean;
  demoMaps?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  defaultDarkMode,
  demo = 'off',
  showLegend = false,
  headingLevel = 1,
  standalone = true,
  rows,
  columns,
  showPresets = false,
  demoMaps = false,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { visualTheme, setNumberOfRows, setNumberOfColumns } = useControlsBoundedStore();

  // The starting grid size. Set before the demo seeds, so its scene fits the grid it lands on.
  useLayoutEffect(() => {
    if (rows) setNumberOfRows(rows);
    if (columns) setNumberOfColumns(columns);
  }, [rows, columns, setNumberOfRows, setNumberOfColumns]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (defaultDarkMode !== undefined) {
      return defaultDarkMode;
    }
    const saved = localStorage.getItem('astar-darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useDemoMode(demo, rootRef, demoMaps);

  useEffect(() => {
    if (defaultDarkMode === undefined) {
      localStorage.setItem('astar-darkMode', JSON.stringify(isDarkMode));
    }
    if (rootRef.current) {
      rootRef.current.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
      rootRef.current.setAttribute('data-visual-theme', visualTheme);
    }
  }, [isDarkMode, defaultDarkMode, visualTheme]);

  const Heading = headingLevel === 'none' ? null : (`h${headingLevel}` as const);
  const GridRegion = standalone ? 'main' : 'div';

  return (
    <div ref={rootRef} className="astar-visualizer-root" data-theme={isDarkMode ? 'dark' : 'light'} data-visual-theme={visualTheme}>
      <div className="app-container">
        {Heading && (
          <header className="app-header">
            <Heading className="app-title">A* Pathfinding Visualizer</Heading>
          </header>
        )}

        <Toolbar />

        <GridRegion className="app-main">
          <Grid />
        </GridRegion>

        {showPresets && <PresetBar />}

        {showLegend && <Legend />}

        <StatsPanel />

        <SettingsPanel isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} hidePresets={showPresets} />
      </div>
    </div>
  );
};
