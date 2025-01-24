import { aStarNode, Cell } from '../types.ts';
import { CellState } from '../enums.ts';

export const heuristic = (a: Cell, b: Cell): number => {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
};

export const initializeStartNode = (
  start: { col: number; row: number; state: CellState },
  end: { col: number; row: number; state: CellState },
): aStarNode => {
  return {
    row: start.row,
    col: start.col,
    g: 0, 
    h: heuristic(start, end), 
    f: heuristic(start, end), 
    parent: null,
  };
};

export const getNeighbors = (
  node : aStarNode,
  grid: Cell[][]
): { row : number; col : number; state: CellState; }[] => {
  const neighbors = [
    { row: node.row - 1, col: node.col },
    { row: node.row + 1, col: node.col },
    { row: node.row, col: node.col - 1 },
    { row: node.row, col: node.col + 1 },
    { row: node.row - 1, col: node.col - 1 },
    { row: node.row - 1, col: node.col + 1 },
    { row: node.row + 1, col: node.col - 1 },
    { row: node.row + 1, col: node.col + 1 },
  ];

  return neighbors
    .filter((neighbor) => {
      return (
        neighbor.row >= 0 &&
        neighbor.row < grid.length &&
        neighbor.col >= 0 &&
        neighbor.col < grid[0].length &&
        grid[neighbor.row][neighbor.col].state !== CellState.Obstacle
      );
    })
    .map((neighbor) => ({
      row: neighbor.row,
      col: neighbor.col,
      state: grid[neighbor.row][neighbor.col].state,
    }));
}

export const calculateCosts = (
  node: aStarNode,
  neighbor: { col: number; row: number; state: CellState },
  end: { col: number; row: number; state: CellState },
): { g: number; h: number; f: number } => {
  const g = node.g + 1; 
  const h = heuristic(neighbor, end);
  const f = g + h; 
  return { g, h, f };
};

export const reconstructPath = (endNode: aStarNode): aStarNode[] => {
  const path: aStarNode[] = [];
  let current: aStarNode | null = endNode;

  while (current) {
    path.push(current);
    current = current.parent;
  }

  return path.reverse();
};

export const aStar = (
  grid: { col: number; row: number; state: CellState }[][],
  start: FlatArray<Cell[][], 1>,
  end: FlatArray<Cell[][], 1>,
): { path: aStarNode[]; visitedNodes: aStarNode[] } => {
  const openSet: aStarNode[] = [];
  const closedSet: aStarNode[] = [];

  const startNode = initializeStartNode(start, end);
  openSet.push(startNode);

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);

    const currentNode = openSet.shift()!;

    if (currentNode.row === end.row && currentNode.col === end.col) {
      return { path: reconstructPath(currentNode), visitedNodes: closedSet };
    }

    closedSet.push(currentNode);

    const neighbors = getNeighbors(currentNode, grid);

    for (const neighbor of neighbors) {
      if (closedSet.some((node) => node.row === neighbor.row && node.col === neighbor.col)) {
        continue;
      }

      const { g, h, f } = calculateCosts(currentNode, neighbor, end);

      const neighborNode = openSet.find(
        (node) => node.row === neighbor.row && node.col === neighbor.col
      );

      if (!neighborNode || g < neighborNode.g) {
        const newNode: aStarNode = {
          row: neighbor.row,
          col: neighbor.col,
          g,
          h,
          f,
          parent: currentNode,
        };

        if (!neighborNode) {
          openSet.push(newNode);
        } else {
          neighborNode.g = g;
          neighborNode.f = f;
          neighborNode.parent = currentNode;
        }
      }
    }
  }

  return { path: [], visitedNodes: closedSet };
};