import React from 'react';
import { Grid } from '../Grid/Grid.tsx';
import { ControlPanel } from '../ControlPanel/ControlPanel.tsx';

export const Layout: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh', 
        width: '100vw', 
        backgroundColor: '#f0f0f0',
      }}
    >
      <div
        style={{
          width: '300px',
          backgroundColor: '#ffffff', 
          boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
          padding: '20px',
        }}
      >
        <ControlPanel />
      </div>

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
    </div>
  );
};