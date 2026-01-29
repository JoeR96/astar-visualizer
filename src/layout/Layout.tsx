import React, { useState, useEffect, useRef } from 'react';
import { Grid } from '../grid/Grid.tsx';
import { Toolbar } from '../toolbar/Toolbar.tsx';
import { StatsPanel } from '../statistics/StatsPanel.tsx';
import { SettingsPanel } from '../settings/SettingsPanel.tsx';
import { useControlsBoundedStore } from '../BoundedStore.ts';

export interface LayoutProps {
  defaultDarkMode?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ defaultDarkMode }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { visualTheme } = useControlsBoundedStore();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (defaultDarkMode !== undefined) {
      return defaultDarkMode;
    }
    const saved = localStorage.getItem('astar-darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (defaultDarkMode === undefined) {
      localStorage.setItem('astar-darkMode', JSON.stringify(isDarkMode));
    }
    if (rootRef.current) {
      rootRef.current.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
      rootRef.current.setAttribute('data-visual-theme', visualTheme);
    }
  }, [isDarkMode, defaultDarkMode, visualTheme]);

  return (
    <div ref={rootRef} className="astar-visualizer-root" data-theme={isDarkMode ? 'dark' : 'light'} data-visual-theme={visualTheme}>
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">A* Pathfinding Visualizer</h1>
        </header>

        <Toolbar />

        <main className="app-main">
          <Grid />
        </main>

        <StatsPanel />

        <SettingsPanel isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </div>
    </div>
  );
};