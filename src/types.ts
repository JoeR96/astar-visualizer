import { CellState } from './enums.ts';

export interface Node {
  x: number;
  y: number;
  cost: number;
  heuristic: number;
  total: number;
  parent?: Node;
  order: number;
}

export type Cell = {
  row: number;
  col: number;
  state: CellState;
};