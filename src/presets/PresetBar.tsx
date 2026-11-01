import React from 'react';
import { useControlsBoundedStore } from '../BoundedStore';
import { CellState } from '../enums';
import { getTheme } from '../themes/index';
import { buildPresetScene } from '../themes/presets';

/**
 * One-click maps under the grid. They used to live only inside Settings, so a visitor
 * never found the terrain maps, which are the part that shows A* weighing costs.
 * Picking one lays the map out and runs the search straight away.
 */
export const PresetBar: React.FC = () => {
  const { rows, columns, visualTheme, applyScene, setSelectedButtonState, handleFindPath, canTravelDiagonally } =
    useControlsBoundedStore();
  const presets = getTheme(visualTheme).presets;

  const run = (presetId: string) => {
    const scene = buildPresetScene(presetId, rows, columns, visualTheme);
    if (scene.length === 0) return;
    applyScene(scene);
    setSelectedButtonState(CellState.Obstacle);
    handleFindPath(canTravelDiagonally);
  };

  return (
    <div className="astar-presets" role="group" aria-label="Try a map">
      <span className="astar-presets-label">Try a map</span>
      {presets.map(p => (
        <button key={p.id} type="button" className="astar-preset-button" onClick={() => run(p.id)}>
          {p.name}
        </button>
      ))}
    </div>
  );
};
