import React, { useState, useEffect } from 'react';
import { useControlsBoundedStore } from '../BoundedStore.ts';
import { CellState } from '../enums.ts';
import { Cell } from '../types.ts';
import { getTheme } from '../themes/index.ts';
import './grid.css';

export const Grid: React.FC = () => {
  const { cells, activeButton, setCellState, setSelectedButtonState, visitedNodes, path, visualTheme, showCosts } = useControlsBoundedStore();
  const theme = getTheme(visualTheme);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
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

  // Calculate responsive cell size based on available container space
  const getCellSize = () => {
    if (!containerSize.width || !containerSize.height) return 20;
    
    const cols = cells[0]?.length || 1;
    const rows = cells.length || 1;
    
    // Account for padding and gaps
    const padding = 20;
    const gap = cols + rows; // Total gap space
    
    const availableWidth = containerSize.width - padding - gap;
    const availableHeight = containerSize.height - padding - gap;
    
    const cellSizeByWidth = availableWidth / cols;
    const cellSizeByHeight = availableHeight / rows;
    
    // Use the smaller dimension to ensure everything fits
    const size = Math.min(cellSizeByWidth, cellSizeByHeight);
    
    // Clamp between reasonable min/max
    return Math.max(15, Math.min(size, 60));
  };

  const cellSize = getCellSize();

  return (
    <div className="grid-wrapper" ref={containerRef}>
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
                {isVisited && showCosts && (
                  <div className="cell-values">
                    <div className="value-h">h{h}</div>
                    <div className="value-f">f{f}</div>
                    <div className="value-g">g{g}</div>
                  </div>
                )}

                {/* Theme-based cell indicators */}
                {cell.state === CellState.Start && (
                  <div className="cell-indicator start">{theme.startIcon}</div>
                )}
                {cell.state === CellState.End && (
                  <div className="cell-indicator end">{theme.endIcon}</div>
                )}
                {cell.state === CellState.Obstacle && (
                  <div className="cell-indicator obstacle">{theme.terrains[CellState.Obstacle]?.icon || '■'}</div>
                )}
                {cell.state === CellState.Water && (
                  <div className="cell-indicator water">{theme.terrains[CellState.Water]?.icon || '🌊'}</div>
                )}
                {cell.state === CellState.Forest && (
                  <div className="cell-indicator forest">{theme.terrains[CellState.Forest]?.icon || '🌲'}</div>
                )}
                {cell.state === CellState.Mountain && (
                  <div className="cell-indicator mountain">{theme.terrains[CellState.Mountain]?.icon || '⛰️'}</div>
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
    case CellState.Water:
      return 'var(--cell-water)';
    case CellState.Forest:
      return 'var(--cell-forest)';
    case CellState.Mountain:
      return 'var(--cell-mountain)';
    case CellState.Empty:
      return 'var(--cell-empty)';
    default:
      return 'var(--cell-empty)';
  }
};