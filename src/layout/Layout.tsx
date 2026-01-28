import React, { useState, useEffect, useRef } from 'react';
import { Grid } from '../grid/Grid.tsx';
import { ControlPanel } from '../control-panel/ControlPanel.tsx';
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
          <h1 className="app-title">A* Pathfinding</h1>
        </header>

        <main className="app-main">
          <Grid />
        </main>

        <footer className="app-footer">
          <ControlPanel isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        </footer>
      </div>
    </div>
  );
};