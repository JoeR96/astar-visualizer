import create from 'zustand';
import { TileState } from '../enums/TileStates';
import useLayoutStore from '../Layout/layoutStore';

type GridCell = {
    row: number;
    col: number;
    state: TileState;
};

type GridStore = {
    cells: GridCell[];
    start: GridCell | null;
    end: GridCell | null;
    obstacles: GridCell[];
    setCell: (row: number, col: number, state: TileState) => void;
    resetAllCells: () => void;
    findPath: () => void;
    version: number;
    getGridState: () => TileState[][];
    rows: number;
    cols: number;
    setRows: (rows: number) => void;
    setCols: (cols: number) => void;
    path: GridCell[];
};


const useGridStore = create<GridStore>((set, get) => ({
    version: 0,
    rows: 8, // Initialize rows and cols here
    cols: 12,
    cells: [], // Set it as an empty array initially
    start: null,
    end: null,
    obstacles: [],
    path: [],
    getGridState: () => {
        const numRows = get().rows;
        const numCols = get().cols;


        let grid: TileState[][] = Array.from({ length: numRows }, () => Array.from({ length: numCols }, () => TileState.NORMAL));

        get().cells.forEach(cell => {
            if (cell.row < numRows && cell.col < numCols) {
                grid[cell.row][cell.col] = cell.state;
            } else {
                console.log(grid)
                console.error(`Out of bounds: Row=${cell.row}, Col=${cell.col}`);
            }
        });

        return grid;
    },
    setCell: (row, col, state) => {
        console.log("setting cell state", state)
        const updatedCells = [...get().cells];
        const cellIndex = updatedCells.findIndex(cell => cell.row === row && cell.col === col);

        // Check if the cell exists and update its state
        if (cellIndex !== -1) {
            updatedCells[cellIndex].state = state;
        } else {
            // This shouldn't happen if your initialization logic is correct, but just in case
            updatedCells.push({ row, col, state });
        }

        let updatedStart = get().start;
        let updatedEnd = get().end;
        let updatedObstacles = [...get().obstacles];

        const cellExists = (arr, cell) => arr.some(e => e.row === cell.row && e.col === cell.col);

        // Handle removal of previous states
        if (cellExists(updatedObstacles, { row, col })) {
            updatedObstacles = updatedObstacles.filter(cell => cell.row !== row || cell.col !== col);
        }
        if (updatedStart && updatedStart.row === row && updatedStart.col === col) {
            updatedStart = null;
        }
        if (updatedEnd && updatedEnd.row === row && updatedEnd.col === col) {
            updatedEnd = null;
        }

        switch (state) {
            case TileState.START:
                if (updatedStart) { // Reset the previous start cell to NORMAL
                    const previousStartIndex = updatedCells.findIndex(cell => cell.row === updatedStart.row && cell.col === updatedStart.col);
                    if (previousStartIndex !== -1) {
                        updatedCells[previousStartIndex].state = TileState.NORMAL;
                    }
                }
                updatedStart = { row, col, state };
                break;
            case TileState.END:
                if (updatedEnd) { // Reset the previous end cell to NORMAL
                    const previousEndIndex = updatedCells.findIndex(cell => cell.row === updatedEnd.row && cell.col === updatedEnd.col);
                    if (previousEndIndex !== -1) {
                        updatedCells[previousEndIndex].state = TileState.NORMAL;
                    }
                }
                updatedEnd = { row, col, state };
                break;
            case TileState.OBSTACLE:
                updatedObstacles.push({ row, col, state });
                break;
            case TileState.PATH:
                // Here, you can implement any logic specific to setting a cell to PATH.
                // For this example, I'll just set the cell to PATH without any additional checks.
                break;
            case TileState.NORMAL:
                // Reset the selected cell to NORMAL state
                const resetIndex = updatedCells.findIndex(cell => cell.row === row && cell.col === col);
                if (resetIndex !== -1) {
                    updatedCells[resetIndex].state = TileState.NORMAL;
                }
                break;
            default:
                // Optionally handle other states or default cases
                break;
        }

        const newVersion = get().version + 1;

        set({
            cells: updatedCells,
            start: updatedStart,
            end: updatedEnd,
            obstacles: updatedObstacles,
            version: newVersion
        });
    },
    resetAllCells: () => {
        const numRows = get().cells.filter(cell => cell.col === 0).length;
        const numCols = get().cells.filter(cell => cell.row === 0).length;

        const allNormalCells = [];
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                allNormalCells.push({ row, col, state: TileState.NORMAL });
            }
        }

        set({
            cells: allNormalCells, // Set all cells to NORMAL directly
            start: null,
            end: null,
            obstacles: [],
            path: [] // Clear the path
        });
    }
    ,
    setRows: (rows) => {
        const initialCells = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < get().cols; j++) {
                initialCells.push({ row: i, col: j, state: TileState.NORMAL });
            }
        }
        set({ rows, cells: initialCells });
    },

    setCols: (cols) => {
        const initialCells = [];
        for (let i = 0; i < get().rows; i++) {
            for (let j = 0; j < cols; j++) {
                initialCells.push({ row: i, col: j, state: TileState.NORMAL });
            }
        }
        set({ cols, cells: initialCells });
    },
    findPath: () => {
        const { cells } = get();
        const startCell = cells.find(cell => cell.state === TileState.START);
        const endCell = cells.find(cell => cell.state === TileState.END);

        if (startCell && endCell) {
            const path = generateRandomPath(cells, startCell, endCell);
            if (path) {
                console.log(startCell, endCell)
                console.log(path)
                path.forEach(p => setCell(p.row, p.col, TileState.PATH));
            } else {
                console.error("No path found!");
            }
        } else {
            console.error("Start or end point is missing!");
        }
    }
}));

function generateRandomPath(cells: GridCell[], start: GridCell, end: GridCell): GridCell[] {
    // Placeholder logic for demonstration purposes.
    // This logic will create a straight line between the start and end which may not be feasible due to obstacles.

    const path: GridCell[] = [];

    const rowDir = start.row <= end.row ? 1 : -1;
    const colDir = start.col <= end.col ? 1 : -1;

    for (let row = start.row; row !== end.row + rowDir; row += rowDir) {
        path.push({ row, col: start.col, state: TileState.PATH });
    }
    for (let col = start.col; col !== end.col + colDir; col += colDir) {
        path.push({ row: end.row, col, state: TileState.PATH });
    }

    return path;
}


export default useGridStore;