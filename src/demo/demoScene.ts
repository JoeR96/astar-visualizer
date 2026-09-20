import { CellState } from '../enums.ts';

/**
 * A small hand-placed scene for the default 8x12 grid.
 *
 * The walls form a barrier with a single gap, so the search visibly spreads,
 * hits the wall, works around it and commits to a route - which reads as
 * pathfinding rather than as a grid filling in.
 */
export const DEMO_START = { row: 6, col: 1 };
export const DEMO_END = { row: 1, col: 10 };

export const DEMO_WALLS: ReadonlyArray<{ row: number; col: number }> = [
  { row: 0, col: 5 },
  { row: 1, col: 5 },
  { row: 2, col: 5 },
  { row: 3, col: 5 },
  { row: 5, col: 5 },
  { row: 6, col: 5 },
  { row: 7, col: 5 },
  { row: 2, col: 8 },
  { row: 3, col: 8 },
  { row: 4, col: 8 },
  { row: 5, col: 8 },
];

export const DEMO_CELLS: ReadonlyArray<{ row: number; col: number; state: CellState }> = [
  { ...DEMO_START, state: CellState.Start },
  { ...DEMO_END, state: CellState.End },
  ...DEMO_WALLS.map(wall => ({ ...wall, state: CellState.Obstacle })),
];
