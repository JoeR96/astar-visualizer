import { StateCreator } from 'zustand';

type Cell = {
  row: number;
  col: number;
  state: CellState;
};

enum CellState {
  Empty,
  Start,
  End,
  Obstacle,
}

export interface GridSlice {
  cells: Cell[][];
  rows: number;
  columns: number;
  startTile: { row: number; col: number } | null;
  endTile: { row: number; col: number } | null;
  obstacleTiles: { row: number; col: number }[];
  setNumberOfColumns: (numberOfColumns: number) => void;
  setNumberOfRows: (numberOfRows: number) => void;
  setCellState: (row: number, col: number, state: CellState) => void;
  resetCells: () => void;
}

export const createGridSlice: StateCreator<GridSlice, [], [], GridSlice> = (set) => ({
  cells: Array.from({ length: 8 }, (_, row) =>
    Array.from({ length: 12 }, (_, col) => ({
      row,
      col,
      state: CellState.Empty,
    }))
  ),
  rows: 8,
  columns: 12,
  startTile: null,
  endTile: null,
  obstacleTiles: [],
  setNumberOfColumns: (numberOfColumns) => {
    set((state) => {
      const newCells = state.cells.map((row) => {
        if (numberOfColumns > state.columns) {
          return [
            ...row,
            ...Array.from({ length: numberOfColumns - state.columns }, (_, col) => ({
              row: row[0].row,
              col: state.columns + col,
              state: CellState.Empty,
            })),
          ];
        }
        return row.slice(0, numberOfColumns);
      });

      return {
        ...state,
        columns: numberOfColumns,
        cells: newCells,
      };
    });
  },
  setNumberOfRows: (numberOfRows) => {
    set((state) => {
      let newCells = [...state.cells];

      if (numberOfRows > state.rows) {
        newCells = [
          ...newCells,
          ...Array.from({ length: numberOfRows - state.rows }, (_, row) =>
            Array.from({ length: state.columns }, (_, col) => ({
              row: state.rows + row,
              col,
              state: CellState.Empty,
            }))
          ),
        ];
      } else {
        newCells = newCells.slice(0, numberOfRows);
      }

      return {
        ...state,
        rows: numberOfRows,
        cells: newCells,
      };
    });
  },
  setCellState: (row, col, state) => {
    set((prevState) => {
      const newCells = prevState.cells.map((r) => r.map((cell) => ({ ...cell })));
      let startTile = prevState.startTile;
      let endTile = prevState.endTile;
      let obstacleTiles = [...prevState.obstacleTiles];
      if (state === CellState.Start && prevState.startTile) {
        newCells[prevState.startTile.row][prevState.startTile.col].state = CellState.Empty;
        startTile = null;
      }
      if (state === CellState.End && prevState.endTile) {
        newCells[prevState.endTile.row][prevState.endTile.col].state = CellState.Empty;
        endTile = null;
      }

      newCells[row][col].state = state;
 
      switch (CellState[state]) {
        case CellState.Start:
          startTile = { row, col };
          break;
        case CellState.End:
          endTile = { row, col };
          break;
        case CellState.Obstacle:
          if (!obstacleTiles.some((tile) => tile.row === row && tile.col === col)) {
            obstacleTiles.push({ row, col });
          }
          break;
        case CellState.Empty:
          obstacleTiles = obstacleTiles.filter((tile) => !(tile.row === row && tile.col === col));
          break;
      }

      return {
        ...prevState,
        cells: newCells,
        startTile,
        endTile,
        obstacleTiles,
      };
    });
  },
  resetCells: () => {
    set((state) => ({
      ...state,
      cells: state.cells.map((row) =>
        row.map((cell) => ({
          ...cell,
          state: CellState.Empty,
        }))
      ),
      startTile: null,
      endTile: null,
      obstacleTiles: [],
    }));
  },
});