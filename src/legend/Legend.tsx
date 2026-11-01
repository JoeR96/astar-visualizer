import React from 'react';
import { useControlsBoundedStore } from '../BoundedStore';
import { CellState } from '../enums';
import { getTheme } from '../themes/index';
import { FOREST_COST_MULTIPLIER } from '../services/astarService';

type LegendItem = { label: string; varName: string };

/**
 * Without this the grid is an unlabelled block of colour: a visitor can watch a
 * search run and still not know which cells are the frontier, which are settled
 * and which are the chosen route.
 */
const ITEMS: LegendItem[] = [
  { label: 'Start', varName: '--cell-start' },
  { label: 'Goal', varName: '--cell-end' },
  { label: 'Wall', varName: '--cell-obstacle' },
  { label: 'Explored', varName: '--cell-visited' },
  { label: 'Path', varName: '--cell-path' },
];

// The theme's terrain, always listed for that theme: adding it only while it was on the grid
// changed the key's height between maps, and the grid resized with it
const TERRAIN: { state: CellState; item: LegendItem }[] = [
  { state: CellState.Forest, item: { label: `Forest (costs ${FOREST_COST_MULTIPLIER}x)`, varName: '--cell-forest' } },
  { state: CellState.Water, item: { label: 'Water (blocked)', varName: '--cell-water' } },
  { state: CellState.Mountain, item: { label: 'Mountain (blocked)', varName: '--cell-mountain' } },
];

export const Legend: React.FC = () => {
  const visualTheme = useControlsBoundedStore(s => s.visualTheme);
  const terrains = getTheme(visualTheme).terrains;
  const items = [...ITEMS, ...TERRAIN.filter(t => t.state in terrains).map(t => t.item)];
  return (
    <ul className="astar-legend" aria-label="Grid colour key">
      {items.map(item => (
        <li key={item.label} className="astar-legend-item">
          <span
            className="astar-legend-swatch"
            style={{ background: `var(${item.varName})` }}
            aria-hidden="true"
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
};
