import { CellState } from './enums.ts';

export type Cell = {
  row: number;
  col: number;
  state: CellState;
};

export type aStarNode = {
  row: number;
  col: number;
  g: number;
  h: number;
  f: number;
  parent: aStarNode | null;
};
