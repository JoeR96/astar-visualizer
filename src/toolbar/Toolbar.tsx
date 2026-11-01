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

  // These pick what a click on the grid paints. Plain "Start" read as "run the demo",
  // so each label says what it does to the grid; Find Path is the only button that runs.
  const tools = [
    { label: 'Move start', state: CellState.Start, className: 'start' },
    { label: 'Move goal', state: CellState.End, className: 'end' },
    { label: 'Draw walls', state: CellState.Obstacle, className: 'wall' },
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
      <div className="toolbar-section tools" role="group" aria-label="Click the grid to">
        {tools.map(({ label, state, className }) => (
          <button
            key={label}
            className={`toolbar-button ${className} ${activeButton === state ? 'active' : ''}`}
            aria-pressed={activeButton === state}
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
