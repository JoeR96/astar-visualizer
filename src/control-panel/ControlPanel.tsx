import React from 'react';
import { useControlsBoundedStore } from '../BoundedStore.ts';
import { CellState } from '../enums.ts';
import './control-panel.css';

export const ControlPanel: React.FC = () => {
  const {
    activeButton,
    setSelectedButtonState,
    resetCells,
    rows,
    columns,
    setNumberOfRows,
    setNumberOfColumns,
    handleFindPath,
    canTravelDiagonally,
    setCanTravelDiagonally,
  } = useControlsBoundedStore();

  const buttons = [
    { label: 'Start', state: CellState.Start },
    { label: 'End', state: CellState.End },
    { label: 'Obstacle', state: CellState.Obstacle },
    { label: 'Clear', state: CellState.Empty },
    { label: 'Reset', state: null },
  ];

  const handleButtonClick = (buttonState: CellState | null) => {
    if (buttonState === null) {
      handleResetClick();
    } else {
      setSelectedButtonState(buttonState);
    }
  };

  const handleResetClick = () => {
    resetCells();
    setSelectedButtonState(CellState.Start);
  };

  const handleFindPathClick = () => {
    handleFindPath(canTravelDiagonally);
  };

  return (
    <div className="control-panel">
      <div className="control-grid">
        {/* Tools Section */}
        <div className="control-group tools">
          <h3 className="group-title">Tools</h3>
          <div className="button-group">
            {buttons.map((button, index) => (
              <button
                key={index}
                className={`control-button ${button.label.toLowerCase()} ${
                  activeButton === button.state ? 'active' : ''
                }`}
                onClick={() => handleButtonClick(button.state)}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions Section */}
        <div className="control-group actions">
          <h3 className="group-title">Actions</h3>
          <div className="button-group">
            <button
              className="control-button find-path"
              onClick={handleFindPathClick}
            >
              Find Path
            </button>
            <button
              className={`control-button diagonal ${canTravelDiagonally ? 'active' : ''}`}
              onClick={() => setCanTravelDiagonally(!canTravelDiagonally)}
            >
              {canTravelDiagonally ? 'Diagonal On' : 'Diagonal Off'}
            </button>
          </div>
        </div>

        {/* Grid Size Section */}
        <div className="control-group size">
          <h3 className="group-title">Grid Size</h3>
          <div className="size-controls">
            <div className="size-control">
              <label className="size-label">Rows</label>
              <div className="size-buttons">
                <button
                  className="size-button"
                  onClick={() => setNumberOfRows(Math.max(5, rows - 1))}
                  disabled={rows <= 5}
                >
                  −
                </button>
                <span className="size-value">{rows}</span>
                <button
                  className="size-button"
                  onClick={() => setNumberOfRows(Math.min(50, rows + 1))}
                  disabled={rows >= 50}
                >
                  +
                </button>
              </div>
            </div>
            <div className="size-control">
              <label className="size-label">Columns</label>
              <div className="size-buttons">
                <button
                  className="size-button"
                  onClick={() => setNumberOfColumns(Math.max(5, columns - 1))}
                  disabled={columns <= 5}
                >
                  −
                </button>
                <span className="size-value">{columns}</span>
                <button
                  className="size-button"
                  onClick={() => setNumberOfColumns(Math.min(50, columns + 1))}
                  disabled={columns >= 50}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
