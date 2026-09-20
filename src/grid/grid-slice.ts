import { StateCreator } from 'zustand';
import { CellState } from '../enums.ts';
import { aStar } from '../services/astarService.ts';
import { aStarNode } from '../types.ts';

type Cell = {
  row: number;
  col: number;
  state: CellState;
};

export interface GridSlice {
  /**
   * Incremented whenever the grid is reset or a new search starts. The path
   * animation is a detached async loop, so it checks this before every write
   * and bails if a newer run has begun - otherwise a reset (or a second Find
   * Path) leaves the previous run still painting cells over the new grid.
   */
  runId: number;
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
  /**
   * Replace the whole grid in a single update. Seeding a scene as
   * reset-then-set-each-cell leaves brief intermediate frames on screen; one
   * atomic write cannot.
   */
  applyScene: (scene: { row: number; col: number; state: CellState }[]) => void;
  /**
   * Abandon any running path animation without touching the grid, so handing
   * control to a visitor mid-run stops the cells moving under them.
   */
  cancelRun: () => void;
  handleFindPath: (canTravelDiagonally: boolean) => void;
  path: aStarNode[];
  visitedNodes: aStarNode[];
  setPath: (path: aStarNode[]) => void;
  setVisitedNodes(visitedNodes: aStarNode[]): void;
}

export const createGridSlice: StateCreator<GridSlice, [], [], GridSlice> = (
  set,
  get,
) => ({
  cells: Array.from({ length: 8 }, (_, row) =>
    Array.from({ length: 12 }, (_, col) => ({
      row,
      col,
      state: CellState.Empty,
    })),
  ),
  runId: 0,
  rows: 8,
  columns: 12,
  startTile: null,
  endTile: null,
  obstacleTiles: [],
  path: [],
  visitedNodes: [],
  setNumberOfColumns: (numberOfColumns) => {
    set((state) => {
      const newCells = state.cells.map((row) => {
        if (numberOfColumns > state.columns) {
          return [
            ...row,
            ...Array.from(
              { length: numberOfColumns - state.columns },
              (_, col) => ({
                row: row[0].row,
                col: state.columns + col,
                state: CellState.Empty,
              }),
            ),
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
            })),
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
      const newCells = prevState.cells.map((r) =>
        r.map((cell) => ({ ...cell })),
      );
      let startTile = prevState.startTile;
      let endTile = prevState.endTile;
      let obstacleTiles = [...prevState.obstacleTiles];
      if (state === CellState.Start && prevState.startTile) {
        newCells[prevState.startTile.row][prevState.startTile.col].state =
          CellState.Empty;
        startTile = null;
      }
      if (state === CellState.End && prevState.endTile) {
        newCells[prevState.endTile.row][prevState.endTile.col].state =
          CellState.Empty;
        endTile = null;
      }

      newCells[row][col].state = state;

      switch (state) {
        case CellState.Start:
          startTile = { row, col };
          break;
        case CellState.End:
          endTile = { row, col };
          break;
        case CellState.Obstacle:
          if (
            !obstacleTiles.some((tile) => tile.row === row && tile.col === col)
          ) {
            obstacleTiles.push({ row, col });
          }
          break;
        case CellState.Empty:
          obstacleTiles = obstacleTiles.filter(
            (tile) => !(tile.row === row && tile.col === col),
          );
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
      runId: state.runId + 1,
      cells: state.cells.map((row) =>
        row.map((cell) => ({
          ...cell,
          state: CellState.Empty,
        })),
      ),
      startTile: null,
      endTile: null,
      obstacleTiles: [],
      path: [],
      visitedNodes: [],
    }));
  },
  cancelRun: () => {
    set((state) => ({ ...state, runId: state.runId + 1 }));
  },
  applyScene: (scene) => {
    set((state) => {
      const cells = state.cells.map((row) =>
        row.map((cell) => ({ ...cell, state: CellState.Empty })),
      );
      let startTile: { row: number; col: number } | null = null;
      let endTile: { row: number; col: number } | null = null;
      const obstacleTiles: { row: number; col: number }[] = [];

      for (const item of scene) {
        if (!cells[item.row] || !cells[item.row][item.col]) continue;
        cells[item.row][item.col].state = item.state;
        if (item.state === CellState.Start) startTile = { row: item.row, col: item.col };
        if (item.state === CellState.End) endTile = { row: item.row, col: item.col };
        if (item.state === CellState.Obstacle) obstacleTiles.push({ row: item.row, col: item.col });
      }

      return {
        ...state,
        runId: state.runId + 1,
        cells,
        startTile,
        endTile,
        obstacleTiles,
        path: [],
        visitedNodes: [],
      };
    });
  },
  handleFindPath: (canTravelDiagonally: boolean) => {
    set((state) => {
      const thisRun = state.runId + 1;
      const startCell = state.cells.flat().find(cell => cell.state === CellState.Start);
      const endCell = state.cells.flat().find(cell => cell.state === CellState.End);

      if (startCell && endCell) {
        const gridForAStar = state.cells.map(row =>
          row.map(cell => ({
            row: cell.row,
            col: cell.col,
            state: cell.state,
          }))
        );

        const { path, visitedNodes } = aStar(gridForAStar, startCell, endCell, canTravelDiagonally);

        const showPathWithDelay = async (path: aStarNode[], visited: aStarNode[]) => {
          for (let node of visited) {
            await new Promise<void>(resolve => setTimeout(resolve, 100));
            if (get().runId !== thisRun) return;
            set((prevState) => {
              const newCells = prevState.cells.map(row =>
                row.map(cell => ({
                  ...cell,
                  state: node.row === cell.row && node.col === cell.col && cell.state === CellState.Empty ? CellState.Visited : cell.state
                }))
              );
              return {
                ...prevState,
                cells: newCells,
                visitedNodes: [...prevState.visitedNodes, node],
              };
            });
          }
          for (let node of path) {
            await new Promise<void>(resolve => setTimeout(resolve, 250));
            if (get().runId !== thisRun) return;
            set((prevState) => {
              const newCells = prevState.cells.map(row =>
                row.map(cell => ({
                  ...cell,
                  // Only mark open ground: overwriting start/end/terrain would erase them for the next run
                  // (the grid colours path cells from the path list, so terrain still shows as part of the route)
                  state: node.row === cell.row && node.col === cell.col &&
                    (cell.state === CellState.Empty || cell.state === CellState.Visited)
                    ? CellState.Path
                    : cell.state
                }))
              );
              return {
                ...prevState,
                cells: newCells,
                path: [...prevState.path, node],
              };
            });
          }
        };

        showPathWithDelay(path, visitedNodes);

        return { ...state, runId: thisRun, path: [], visitedNodes: [] };
      }

      return state;
    });
  },
  setPath: (path) => {
    set((state) => {
      const newCells = state.cells.map(row =>
        row.map(cell => ({
          ...cell,
          state: path.some(p => p.row === cell.row && p.col === cell.col) ? CellState.Path : cell.state,
        }))
      );
      return {
        ...state,
        cells: newCells,
      };
    });
  },
  setVisitedNodes: (visitedNodes) => {
    set((state) => {
      const newCells = state.cells.map(row =>
        row.map(cell => ({
          ...cell,
          state: visitedNodes.some(v => v.row === cell.row && v.col === cell.col) && cell.state === CellState.Empty ? CellState.Visited : cell.state,
        }))
      );
      return {
        ...state,
        cells: newCells,
      };
    });
  },
});
