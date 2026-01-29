import React, { useState } from 'react';
import { useControlsBoundedStore } from '../BoundedStore';
import { CellState, VisualTheme } from '../enums';
import { getTheme, getTerrainTools, THEMES } from '../themes/index';
import {
  generateRiver,
  generateMountainRange,
  generateMaze,
  generateRandomScatter,
  generateClassicRandom,
  generateClassicMaze,
} from '../themes/presets';
import './settings-panel.css';

export interface SettingsPanelProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isDarkMode, setIsDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    rows,
    columns,
    setNumberOfRows,
    setNumberOfColumns,
    visualTheme,
    setVisualTheme,
    canTravelDiagonally,
    setCanTravelDiagonally,
    showCosts,
    setShowCosts,
    activeButton,
    setSelectedButtonState,
    setCellState,
    resetCells,
  } = useControlsBoundedStore();

  const theme = getTheme(visualTheme);
  const terrainTools = getTerrainTools(visualTheme);

  const handlePresetGenerate = (presetId: string) => {
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

    for (const placement of placements) {
      setCellState(placement.row, placement.col, placement.state);
    }

    setCellState(0, 0, CellState.Start);
    setCellState(rows - 1, columns - 1, CellState.End);
    setSelectedButtonState(CellState.Obstacle);
  };

  return (
    <div className={`settings-container ${isOpen ? 'open' : ''}`}>
      <button
        className="settings-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle settings"
        aria-expanded={isOpen}
      >
        <span className="settings-icon">⚙</span>
        <span className="settings-label">Settings</span>
        <span className={`settings-chevron ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="settings-panel">
          <div className="settings-content">
            {/* Appearance Section */}
            <div className="settings-section">
              <h3 className="settings-section-title">Appearance</h3>
              <div className="settings-row">
                <label>Theme</label>
                <select
                  className="settings-select"
                  value={visualTheme}
                  onChange={(e) => setVisualTheme(e.target.value as VisualTheme)}
                >
                  {Object.values(THEMES).map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="settings-row">
                <label>Color Mode</label>
                <div className="settings-toggle-group">
                  <button
                    className={`settings-toggle-btn ${!isDarkMode ? 'active' : ''}`}
                    onClick={() => setIsDarkMode(false)}
                  >
                    Light
                  </button>
                  <button
                    className={`settings-toggle-btn ${isDarkMode ? 'active' : ''}`}
                    onClick={() => setIsDarkMode(true)}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </div>

            {/* Grid Section */}
            <div className="settings-section">
              <h3 className="settings-section-title">Grid</h3>
              <div className="settings-row">
                <label>Rows</label>
                <div className="settings-stepper">
                  <button
                    onClick={() => setNumberOfRows(Math.max(5, rows - 1))}
                    disabled={rows <= 5}
                  >
                    −
                  </button>
                  <span className="stepper-value">{rows}</span>
                  <button
                    onClick={() => setNumberOfRows(Math.min(50, rows + 1))}
                    disabled={rows >= 50}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="settings-row">
                <label>Columns</label>
                <div className="settings-stepper">
                  <button
                    onClick={() => setNumberOfColumns(Math.max(5, columns - 1))}
                    disabled={columns <= 5}
                  >
                    −
                  </button>
                  <span className="stepper-value">{columns}</span>
                  <button
                    onClick={() => setNumberOfColumns(Math.min(50, columns + 1))}
                    disabled={columns >= 50}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Algorithm Section */}
            <div className="settings-section">
              <h3 className="settings-section-title">Algorithm</h3>
              <div className="settings-row">
                <label>Diagonal Movement</label>
                <div className="settings-toggle-group">
                  <button
                    className={`settings-toggle-btn ${!canTravelDiagonally ? 'active' : ''}`}
                    onClick={() => setCanTravelDiagonally(false)}
                  >
                    Off
                  </button>
                  <button
                    className={`settings-toggle-btn ${canTravelDiagonally ? 'active' : ''}`}
                    onClick={() => setCanTravelDiagonally(true)}
                  >
                    On
                  </button>
                </div>
              </div>
              <div className="settings-row">
                <label>Show Costs</label>
                <div className="settings-toggle-group">
                  <button
                    className={`settings-toggle-btn ${!showCosts ? 'active' : ''}`}
                    onClick={() => setShowCosts(false)}
                  >
                    Off
                  </button>
                  <button
                    className={`settings-toggle-btn ${showCosts ? 'active' : ''}`}
                    onClick={() => setShowCosts(true)}
                  >
                    On
                  </button>
                </div>
              </div>
            </div>

            {/* Terrain Section (Medieval only) */}
            {visualTheme === VisualTheme.Medieval && (
              <div className="settings-section">
                <h3 className="settings-section-title">Terrain Tools</h3>
                <div className="settings-terrain-grid">
                  {terrainTools
                    .filter(({ state }) => state !== CellState.Obstacle)
                    .map(({ state, config }) => (
                      <button
                        key={state}
                        className={`settings-terrain-btn ${activeButton === state ? 'active' : ''}`}
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
            <div className="settings-section">
              <h3 className="settings-section-title">Generate Map</h3>
              <div className="settings-preset-grid">
                {theme.presets.map((preset) => (
                  <button
                    key={preset.id}
                    className="settings-preset-btn"
                    onClick={() => handlePresetGenerate(preset.id)}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
