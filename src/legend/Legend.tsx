import React from 'react';

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

export const Legend: React.FC = () => (
  <ul className="astar-legend" aria-label="Grid colour key">
    {ITEMS.map(item => (
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
