import React from 'react';
import { useControlsBoundedStore } from '../BoundedStore';
import { CellState } from '../enums';
import './toolbar.css';

export const Toolbar: React.FC = () => {
  const {
    activeButton,
    setSelectedButtonState,
    handleFindPath,
    canTravelDiagonally,
    resetCells,
  } = useControlsBoundedStore();

  const tools = [
    { label: 'Start', state: CellState.Start, className: 'start' },
    { label: 'End', state: CellState.End, className: 'end' },
    { label: 'Wall', state: CellState.Obstacle, className: 'wall' },
    { label: 'Erase', state: CellState.Empty, className: 'erase' },
  ];

  const handleFindPathClick = () => {
    handleFindPath(canTravelDiagonally);
  };

  const handleResetClick = () => {
    resetCells();
    setSelectedButtonState(CellState.Start);
  };

  return (
    <div className="toolbar">
      <div className="toolbar-section tools">
        {tools.map(({ label, state, className }) => (
          <button
            key={label}
            className={`toolbar-button ${className} ${activeButton === state ? 'active' : ''}`}
            onClick={() => setSelectedButtonState(state)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="toolbar-divider" />

      <button
        className="toolbar-button reset"
        onClick={handleResetClick}
      >
        Clear All
      </button>

      <div className="toolbar-spacer" />

      <button
        className="toolbar-button primary find-path"
        onClick={handleFindPathClick}
      >
        Find Path
      </button>
    </div>
  );
};
