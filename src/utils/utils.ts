import { CellState } from '../enums.ts';


export const getCellColor = (state: CellState): string => {
  switch (state) {
    case CellState.Start:
      return '#4CAF50';
    case CellState.End:
      return '#FF5252';
    case CellState.Obstacle:
      return '#607D8B';
    // case CellState.Path:
    //   return '#FFC107';
    default:
      return '#1e1e1e';
  }
};