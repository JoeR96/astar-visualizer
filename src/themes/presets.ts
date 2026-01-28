import { CellState } from '../enums';

export interface TerrainPlacement {
  row: number;
  col: number;
  state: CellState;
}

export const generateRiver = (rows: number, cols: number): TerrainPlacement[] => {
  const placements: TerrainPlacement[] = [];
  const riverRow = Math.floor(rows / 2);

  // Create horizontal river with 2-3 bridge gaps
  const numBridges = Math.max(2, Math.floor(cols / 6));
  const bridgePositions: number[] = [];

  // Distribute bridges evenly
  for (let i = 0; i < numBridges; i++) {
    const pos = Math.floor((cols / (numBridges + 1)) * (i + 1));
    bridgePositions.push(pos);
  }

  // Place water cells, leaving gaps for bridges
  for (let col = 0; col < cols; col++) {
    if (!bridgePositions.includes(col)) {
      // Main river row
      placements.push({ row: riverRow, col, state: CellState.Water });
      // Make river 2 cells wide for visual appeal
      if (riverRow + 1 < rows) {
        placements.push({ row: riverRow + 1, col, state: CellState.Water });
      }
    }
  }

  // Add some forest along the riverbanks
  for (let col = 0; col < cols; col += 3) {
    if (riverRow - 1 >= 0 && Math.random() > 0.5) {
      placements.push({ row: riverRow - 1, col, state: CellState.Forest });
    }
    if (riverRow + 2 < rows && Math.random() > 0.5) {
      placements.push({ row: riverRow + 2, col, state: CellState.Forest });
    }
  }

  return placements;
};

export const generateMountainRange = (rows: number, cols: number): TerrainPlacement[] => {
  const placements: TerrainPlacement[] = [];

  // Create diagonal mountain range from top-left to bottom-right
  const startRow = Math.floor(rows * 0.2);
  const startCol = Math.floor(cols * 0.1);

  // Calculate slope
  const endRow = Math.floor(rows * 0.8);
  const endCol = Math.floor(cols * 0.9);

  const numPasses = Math.max(2, Math.floor(Math.min(rows, cols) / 5));
  const passPositions: number[] = [];

  // Distribute mountain passes
  for (let i = 0; i < numPasses; i++) {
    passPositions.push(Math.floor((endCol - startCol) / (numPasses + 1) * (i + 1)) + startCol);
  }

  // Draw the mountain range
  for (let col = startCol; col <= endCol; col++) {
    const progress = (col - startCol) / (endCol - startCol);
    const row = Math.floor(startRow + (endRow - startRow) * progress);

    if (!passPositions.some(p => Math.abs(col - p) <= 1)) {
      if (row >= 0 && row < rows) {
        placements.push({ row, col, state: CellState.Mountain });
      }
      // Add some width to the range
      if (row + 1 < rows && Math.random() > 0.3) {
        placements.push({ row: row + 1, col, state: CellState.Mountain });
      }
      if (row - 1 >= 0 && Math.random() > 0.3) {
        placements.push({ row: row - 1, col, state: CellState.Mountain });
      }
    }
  }

  // Add scattered forests near mountains
  for (const placement of [...placements]) {
    if (placement.state === CellState.Mountain) {
      const adjacentPositions = [
        { row: placement.row - 2, col: placement.col },
        { row: placement.row + 2, col: placement.col },
        { row: placement.row, col: placement.col - 2 },
        { row: placement.row, col: placement.col + 2 },
      ];

      for (const pos of adjacentPositions) {
        if (pos.row >= 0 && pos.row < rows && pos.col >= 0 && pos.col < cols && Math.random() > 0.7) {
          if (!placements.some(p => p.row === pos.row && p.col === pos.col)) {
            placements.push({ row: pos.row, col: pos.col, state: CellState.Forest });
          }
        }
      }
    }
  }

  return placements;
};

export const generateMaze = (rows: number, cols: number): TerrainPlacement[] => {
  const placements: TerrainPlacement[] = [];

  // Simple maze using a grid pattern with random openings
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Create walls every 2-3 cells with random gaps
      const isWallRow = row % 3 === 1;
      const isWallCol = col % 3 === 1;

      if (isWallRow || isWallCol) {
        // Leave some random gaps
        if (Math.random() > 0.35) {
          placements.push({ row, col, state: CellState.Obstacle });
        }
      }
    }
  }

  // Ensure corners are clear for start/end
  const clearRadius = 2;
  return placements.filter(p => {
    const nearTopLeft = p.row < clearRadius && p.col < clearRadius;
    const nearBottomRight = p.row >= rows - clearRadius && p.col >= cols - clearRadius;
    return !nearTopLeft && !nearBottomRight;
  });
};

export const generateRandomScatter = (
  rows: number,
  cols: number,
  density: number = 0.25
): TerrainPlacement[] => {
  const placements: TerrainPlacement[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Leave corners clear
      const nearCorner = (row < 2 && col < 2) || (row >= rows - 2 && col >= cols - 2);

      if (!nearCorner && Math.random() < density) {
        // Weight terrain types: more forest, less water/mountains
        const rand = Math.random();
        let terrainType: CellState;
        if (rand < 0.4) {
          terrainType = CellState.Forest;
        } else if (rand < 0.6) {
          terrainType = CellState.Obstacle;
        } else if (rand < 0.8) {
          terrainType = CellState.Water;
        } else {
          terrainType = CellState.Mountain;
        }

        placements.push({ row, col, state: terrainType });
      }
    }
  }

  return placements;
};

export const generateClassicRandom = (
  rows: number,
  cols: number,
  density: number = 0.2
): TerrainPlacement[] => {
  const placements: TerrainPlacement[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Leave corners clear
      const nearCorner = (row < 2 && col < 2) || (row >= rows - 2 && col >= cols - 2);

      if (!nearCorner && Math.random() < density) {
        placements.push({ row, col, state: CellState.Obstacle });
      }
    }
  }

  return placements;
};

export const generateClassicMaze = (rows: number, cols: number): TerrainPlacement[] => {
  const placements: TerrainPlacement[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const isWallRow = row % 3 === 1;
      const isWallCol = col % 3 === 1;

      if (isWallRow || isWallCol) {
        if (Math.random() > 0.35) {
          placements.push({ row, col, state: CellState.Obstacle });
        }
      }
    }
  }

  const clearRadius = 2;
  return placements.filter(p => {
    const nearTopLeft = p.row < clearRadius && p.col < clearRadius;
    const nearBottomRight = p.row >= rows - clearRadius && p.col >= cols - clearRadius;
    return !nearTopLeft && !nearBottomRight;
  });
};
