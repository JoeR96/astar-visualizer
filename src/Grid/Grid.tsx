import React, { useState } from 'react';
import './Grid.css';

interface Props {
  rows: number;
  cols: number;
}

export const Grid: React.FC<Props> = ({ rows, cols }) => {
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  return (
    <div className="grid">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="row">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div
              key={colIndex}
              data-testid={`cell-${rowIndex}-${colIndex}`}
              className={`cell ${
                selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                  ? 'selected'
                  : ''
              }`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};
