import React from 'react';
import { useControlsBoundedStore } from '../BoundedStore.ts';
import { CellState, VisualTheme } from '../enums.ts';
import { getTheme, getTerrainTools, THEMES } from '../themes/index.ts';
import {
  generateRiver,
  generateMountainRange,
  generateMaze,
  generateRandomScatter,
  generateClassicRandom,
  generateClassicMaze,
} from '../themes/presets.ts';
import './control-panel.css';

export interface ControlPanelProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ isDarkMode, setIsDarkMode }) => {
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
    visualTheme,
    setVisualTheme,
    showCosts,
    setShowCosts,
    setCellState,
  } = useControlsBoundedStore();

  const theme = getTheme(visualTheme);
  const terrainTools = getTerrainTools(visualTheme);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

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

  const handlePresetGenerate = (presetId: string) => {
    // First reset the grid
    resetCells();

    let placements;
    if (visualTheme === VisualTheme.Medieval) {
      switch (presetId) {
        case 'river':
          placements = generateRiver(rows, columns);
          break;
        case 'mountains':
          placements = generateMountainRange(rows, columns);
          break;
        case 'maze':
          placements = generateMaze(rows, columns);
          break;
        case 'random':
          placements = generateRandomScatter(rows, columns);
          break;
        default:
          return;
      }
    } else {
      switch (presetId) {
        case 'random':
          placements = generateClassicRandom(rows, columns);
          break;
        case 'maze':
          placements = generateClassicMaze(rows, columns);
          break;
        default:
          return;
      }
    }

    // Apply terrain placements
    for (const placement of placements) {
      setCellState(placement.row, placement.col, placement.state);
    }

    // Set default start and end positions
    setCellState(0, 0, CellState.Start);
    setCellState(rows - 1, columns - 1, CellState.End);
    setSelectedButtonState(CellState.Obstacle);
  };

  return (
    <div className="control-panel">
      <div className="control-grid">
        {/* Theme & Visual Section */}
        <div className="control-group theme-section">
          <h3 className="group-title">Theme</h3>
          <div className="button-group">
            <select
              className="theme-select"
              value={visualTheme}
              onChange={(e) => setVisualTheme(e.target.value as VisualTheme)}
            >
              {Object.values(THEMES).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <button
              className={`control-button theme-toggle ${isDarkMode ? 'active' : ''}`}
              onClick={toggleDarkMode}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button
              className={`control-button show-costs ${showCosts ? 'active' : ''}`}
              onClick={() => setShowCosts(!showCosts)}
              title={showCosts ? 'Hide costs' : 'Show costs'}
            >
              {showCosts ? '📊 Costs On' : '📊 Costs Off'}
            </button>
          </div>
        </div>

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

        {/* Terrain Tools (theme-specific) */}
        {visualTheme === VisualTheme.Medieval && (
          <div className="control-group terrain">
            <h3 className="group-title">Terrain</h3>
            <div className="button-group">
              {terrainTools
                .filter(({ state }) => state !== CellState.Obstacle)
                .map(({ state, config }) => (
                  <button
                    key={state}
                    className={`control-button terrain-btn ${config.name.toLowerCase()} ${
                      activeButton === state ? 'active' : ''
                    }`}
                    onClick={() => setSelectedButtonState(state)}
                    title={config.passable ? 'Passable terrain' : 'Impassable terrain'}
                  >
                    {config.icon} {config.name}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Presets Section */}
        <div className="control-group presets">
          <h3 className="group-title">Generate Map</h3>
          <div className="button-group">
            {theme.presets.map((preset) => (
              <button
                key={preset.id}
                className="control-button preset-btn"
                onClick={() => handlePresetGenerate(preset.id)}
              >
                {preset.icon} {preset.name}
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
