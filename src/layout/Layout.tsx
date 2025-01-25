import React from 'react';
import { Grid } from '../grid/Grid.tsx';
import { ControlPanel } from '../control-panel/ControlPanel.tsx';

export const Layout: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh', 
        width: '100vw', 
        backgroundColor: '#f0f0f0',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        }}
      >
        <Grid />
      </div>
      <div
        style={{
          padding: '20px',
        }}
      >
        <ControlPanel />
      </div>
    </div>
  );
};