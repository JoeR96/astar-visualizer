import React from 'react';
import { Grid } from '../grid/Grid.tsx';
import { ControlPanel } from '../control-panel/ControlPanel.tsx';

export const Layout: React.FC = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">A* Pathfinding</h1>
      </header>
      
      <main className="app-main">
        <Grid />
      </main>
      
      <footer className="app-footer">
        <ControlPanel />
      </footer>
    </div>
  );
};