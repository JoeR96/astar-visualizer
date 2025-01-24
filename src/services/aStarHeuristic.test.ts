import { aStarNode, Cell } from '../types';
import {
  aStar,
  calculateCosts,
  getNeighbors,
  heuristic,
  initializeStartNode,
  reconstructPath,
} from './astarService.ts';
import { CellState } from '../enums.ts';

//The manhattan distance is (row1 - row2) + (col1 - col2)
describe('heuristic', () => {
  it('should calculate the Manhattan distance between two nodes', () => {
    const nodeA: Cell = { row: 3, col: 0, state: CellState.Start };
    const nodeB: Cell = { row: 0, col: 4, state: CellState.End };

    expect(heuristic(nodeA, nodeB)).toBe(50);
  });
});


describe('initializeStartNode', () => {
  it('creates a start node with the correct properties', () => {
    const start = { row: 0, col: 0, state: CellState.Start };
    const end = { row: 5, col: 5, state: CellState.Start };

    const node: aStarNode = initializeStartNode(start, end);

    expect(node.row).toBe(start.row);
    expect(node.col).toBe(start.col);
    expect(node.g).toBe(0);
    expect(node.h).toBeGreaterThanOrEqual(0);
    expect(node.f).toBe(node.h);
    expect(node.parent).toBeNull();
  });
});


describe('getNeighbors', () => {
  it('should find all valid neighboring nodes', () => {
    const grid: Cell[][] = [
      [
        { row: 0, col: 0, state: CellState.Empty },
        { row: 0, col: 1, state: CellState.Obstacle },
        { row: 0, col: 2, state: CellState.Empty }
      ],
      [
        { row: 1, col: 0, state: CellState.Empty },
        { row: 1, col: 1, state: CellState.Empty },
        { row: 1, col: 2, state: CellState.Empty }
      ],
      [
        { row: 2, col: 0, state: CellState.Empty },
        { row: 2, col: 1, state: CellState.Obstacle },
        { row: 2, col: 2, state: CellState.Empty }
      ]
    ];

    const node: aStarNode = { row: 1, col: 1, g: 0, h: 0, f: 0, parent: null };
    const neighbors = getNeighbors(node, grid);

    expect(neighbors).toEqual([
      { row: 1, col: 0, state: CellState.Empty },
      { row: 1, col: 2, state: CellState.Empty },
      { row: 0, col: 0, state: CellState.Empty },
      { row: 0, col: 2, state: CellState.Empty },
      { row: 2, col: 0, state: CellState.Empty },
      { row: 2, col: 2, state: CellState.Empty }
    ].filter(({ row, col }) => grid[row][col].state !== CellState.Obstacle));
  });
});

describe('calculateCosts', () => {
  it('should calculate the correct g, h, and f costs', () => {
    const node = {
      row: 2,
      col: 3,
      g: 5,
      h: 0,
      f: 5,
      parent: null
    };

    const neighbor = {
      row: 3,
      col: 3,
      state: CellState.Empty
    };

    const end = {
      row: 5,
      col: 5,
      state: CellState.End
    };

    const result = calculateCosts(node, neighbor, end);

    expect(result.g).toBe(15);
    expect(result.h).toBe(28);
    expect(result.f).toBe(43);
  });
});

describe('reconstructPath', () => {
  it('should reconstruct the path from end node to start node in correct order', () => {
    const startNode: aStarNode = { row: 0, col: 0, g: 0, h: 0, f: 0, parent: null };
    const midNode: aStarNode = { row: 1, col: 1, g: 1, h: 0, f: 1, parent: startNode };
    const endNode: aStarNode = { row: 2, col: 2, g: 2, h: 0, f: 2, parent: midNode };

    const path = reconstructPath(endNode);

    expect(path).to.deep.equal([startNode, midNode, endNode]);
  });
});

describe('aStar', () => {
  it('should find the shortest path in a larger grid', () => {
    const grid: Cell[][] = [
      [{ row: 0, col: 0, state: CellState.Empty }, { row: 0, col: 1, state: CellState.Empty }, { row: 0, col: 2, state: CellState.Empty }],
      [{ row: 1, col: 0, state: CellState.Empty }, { row: 1, col: 1, state: CellState.Obstacle }, { row: 1, col: 2, state: CellState.Empty }],
      [{ row: 2, col: 0, state: CellState.Empty }, { row: 2, col: 1, state: CellState.Empty }, { row: 2, col: 2, state: CellState.Empty }]
    ];

    const start = { row: 0, col: 0, state: CellState.Start };
    const end = { row: 2, col: 2, state: CellState.End };

    const result = aStar(grid, start, end);

    expect(result.path).to.have.lengthOf(4);
    expect(result.path[0]).to.deep.include({ row: 0, col: 0 });
    expect(result.path[result.path.length - 1]).to.deep.include({ row: 2, col: 2 });
    expect(result.visitedNodes).to.be.an('array').that.is.not.empty;
  });
});
