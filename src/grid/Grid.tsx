import React, { useState, useEffect } from 'react';
import { useControlsBoundedStore } from '../BoundedStore.ts';
import { CellState } from '../enums.ts';
import { Cell } from '../types.ts';
import './grid.css';

export const Grid: React.FC = () => {
  const { cells, activeButton, setCellState, setSelectedButtonState, visitedNodes, path } = useControlsBoundedStore();
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Calculate responsive cell size for perfect squares - much larger grid
  const getCellSize = () => {
    const isMobile = windowSize.width < 768;
    const isTablet = windowSize.width < 1024;
    
    // Much larger available space for the grid
    const maxWidth = isMobile 
      ? Math.min(windowSize.width * 0.98, 500)
      : isTablet 
        ? Math.min(windowSize.width * 0.95, 800)
        : Math.min(windowSize.width * 0.9, 1000);
        
    const maxHeight = isMobile
      ? Math.min(windowSize.height * 0.75, 500)
      : isTablet
        ? Math.min(windowSize.height * 0.8, 700)
        : Math.min(windowSize.height * 0.85, 800);
    
    const cols = cells[0]?.length || 1;
    const rows = cells.length || 1;
    
    const padding = isMobile ? 16 : 24;
    const cellSizeByWidth = (maxWidth - padding) / cols;
    const cellSizeByHeight = (maxHeight - padding) / rows;
    
    // Much larger minimum and maximum cell sizes for better visibility
    const minSize = isMobile ? 30 : 40;
    const maxSize = isMobile ? 50 : isTablet ? 70 : 90;
    
    return Math.max(minSize, Math.min(cellSizeByWidth, cellSizeByHeight, maxSize));
  };

  const cellSize = getCellSize();

  return (
    <div className="grid-wrapper">
      <div 
        className="grid-container"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cells[0]?.length || 1}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${cells.length || 1}, ${cellSize}px)`,
          gap: '1px',
          padding: '8px',
          background: 'var(--bg-secondary)',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid var(--border-color)',
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
                backgroundColor = 'var(--cell-start)'; 
              } else if (pathIndex === path.length - 1) {
                backgroundColor = 'var(--cell-end)'; 
              } else {
                backgroundColor = 'var(--cell-path)'; 
              }
            }

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="grid-cell"
                onClick={() => handleCellClick(rowIndex, colIndex)}
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: backgroundColor,
                  border: '1px solid var(--cell-border)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '2px',
                }}
                onMouseEnter={(e) => {
                  if (cell.state === CellState.Empty) {
                    e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (cell.state === CellState.Empty) {
                    e.currentTarget.style.backgroundColor = backgroundColor;
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                {isVisited && (
                  <div className="cell-values">
                    <div className="value-h">h{h}</div>
                    <div className="value-f">f{f}</div>
                    <div className="value-g">g{g}</div>
                  </div>
                )}
                
                {/* Minimalistic cell indicators */}
                {cell.state === CellState.Start && (
                  <div className="cell-indicator start">●</div>
                )}
                {cell.state === CellState.End && (
                  <div className="cell-indicator end">●</div>
                )}
                {cell.state === CellState.Obstacle && (
                  <div className="cell-indicator obstacle">■</div>
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
      return 'var(--cell-start)';
    }
    if (cell.state === CellState.End) {
      return 'var(--cell-end)';
    }
    return 'var(--cell-visited)';
  }
  switch (cell.state) {
    case CellState.Start:
      return 'var(--cell-start)';
    case CellState.End:
      return 'var(--cell-end)';
    case CellState.Obstacle:
      return 'var(--cell-obstacle)';
    case CellState.Empty:
      return 'var(--cell-empty)';
    default:
      return 'var(--cell-empty)';
  }
};