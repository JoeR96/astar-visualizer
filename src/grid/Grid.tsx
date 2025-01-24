import React, { useState } from 'react';
import { useControlsBoundedStore } from '../BoundedStore.ts';
import { CellState } from '../enums.ts';
import { aStarNode } from '../types.ts';
import { aStar } from '../services/astarService.ts';

export const Grid: React.FC = () => {
  const { cells, activeButton, setCellState, setSelectedButtonState } = useControlsBoundedStore();
  const [path, setPath] = useState<aStarNode[]>([]);
  const [visitedNodes, setVisitedNodes] = useState<aStarNode[]>([]);

  const handleCellClick = (row: number, col: number) => {
    setCellState(row, col, activeButton);

    switch (activeButton) {
      case CellState.Start:
        setSelectedButtonState(CellState.End);
        break;
      case CellState.End:
        setSelectedButtonState(CellState.Obstacle);
        break;
      default:
        break;
    }
  };

  const handleFindPath = () => {
    const startCell = cells.flat().find(cell => cell.state === CellState.Start);
    const endCell = cells.flat().find(cell => cell.state === CellState.End);

    if (startCell && endCell) {
      const gridForAStar = cells.map(row =>
        row.map(cell => ({
          row: cell.row,
          col: cell.col,
          state: cell.state,
        }))
      );

      const { path, visitedNodes } = aStar(gridForAStar, startCell, endCell);
      setPath(path);
      setVisitedNodes(visitedNodes);
    }
  };

  // Helper function to get the A* node properties (g, h, f) for a specific cell
  const getAStarNodeProperties = (row: number, col: number) => {
    const visitedNode = visitedNodes.find(node => node.row === row && node.col === col);
    if (visitedNode) {
      return { g: visitedNode.g, h: visitedNode.h, f: visitedNode.f };
    }
    return { g: null, h: null, f: null };
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: '#1e1e1e',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cells[0]?.length || 1}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${cells.length || 1}, minmax(0, 1fr))`,
          gap: '2px',
          width: '100%',
          height: '100%',
          padding: '2px',
        }}
      >
        {cells.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isPath = path.some(node => node.row === cell.row && node.col === cell.col);
            const isVisited = visitedNodes.some(node => node.row === cell.row && node.col === cell.col);
            const { g, h, f } = getAStarNodeProperties(cell.row, cell.col);

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '1px solid #333333',
                  backgroundColor: getCellColor(cell.state, isPath, isVisited),
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease, transform 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF20';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = getCellColor(cell.state, isPath, isVisited);
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {isVisited && (
                  <div style={{ position: 'absolute', color: 'white', fontWeight: 'bold' }}>
                    <div>g: {g}</div>
                    <div>h: {h}</div>
                    <div>f: {f}</div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <button
        onClick={handleFindPath}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          backgroundColor: '#4CAF50',
          transition: 'background-color 0.3s ease, transform 0.2s ease',
        }}
      >
        Find Path
      </button>
    </div>
  );
};

const getCellColor = (state: CellState | null, isPath: boolean, isVisited: boolean): string => {
  if (isPath) {
    return '#FFD700'; // Path color
  }
  if (isVisited) {
    return '#00BFFF'; // Visited nodes color
  }
  switch (state) {
    case CellState.Start:
      return '#4CAF50'; // Start cell color
    case CellState.End:
      return '#FF5252'; // End cell color
    case CellState.Obstacle:
      return 'black'; // Obstacle color
    case CellState.Empty:
      return 'gray'; // Empty cell color
    default:
      return '#1e1e1e'; // Default color
  }
};