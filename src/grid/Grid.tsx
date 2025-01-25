import React from 'react';
import { useControlsBoundedStore } from '../BoundedStore.ts';
import { CellState } from '../enums.ts';
import { Cell } from '../types.ts';

export const Grid: React.FC = () => {
  const { cells, activeButton, setCellState, setSelectedButtonState, visitedNodes, path } = useControlsBoundedStore();

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
            const isPathNode = path.some(node => node.row === cell.row && node.col === cell.col);
            const isVisited = visitedNodes.some(node => node.row === cell.row && node.col === cell.col);
            const { g, h, f } = getAStarNodeProperties(cell.row, cell.col);

            let backgroundColor = getCellColor(cell, isVisited);

            if (isPathNode) {
              const pathIndex = path.findIndex(node => node.row === cell.row && node.col === cell.col);
              if (pathIndex === 0) {
                backgroundColor = '#4CAF50'; 
              } else if (pathIndex === path.length - 1) {
                backgroundColor = '#FF5252'; 
              } else {
                backgroundColor = '#FFD700'; 
              }
            }

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '1px solid #333333',
                  backgroundColor: backgroundColor,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease, transform 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF20';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = backgroundColor;
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {isVisited && (
                  <div style={{
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                    <div style={{ gridRow: '1', gridColumn: '1' }}>h{h}</div>
                    <div style={{ gridRow: '1', gridColumn: '3' }}>f{f}</div>
                    <div style={{ gridRow: '2', gridColumn: '2' }}>g{g}</div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const getCellColor = (cell: Cell, isVisited: boolean): string => {
  if (isVisited) {
    if (cell.state === CellState.Start) {
      return '#4CAF50';
    }
    if (cell.state === CellState.End) {
      return '#FFB6C1';
    }
    return '#00BFFF';
  }
  switch (cell.state) {
    case CellState.Start:
      return '#4CAF50';
    case CellState.End:
      return '#FF5252';
    case CellState.Obstacle:
      return 'black';
    case CellState.Empty:
      return 'gray';
    default:
      return 'gray';
  }
};