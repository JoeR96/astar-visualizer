import React from 'react';
import { useControlsBoundedStore } from '../BoundedStore.ts';
import { CellState } from '../enums.ts';

export const Grid: React.FC = () => {
  const { cells, activeButton, setCellState, setSelectedButtonState } = useControlsBoundedStore();

  const handleCellClick = (row: number, col: number) => {
    console.log("active button", CellState[activeButton])
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
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid #333333',
                backgroundColor: getCellColor(cell.state),
                cursor: 'pointer',
                transition: 'background-color 0.2s ease, transform 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF20';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = getCellColor(cell.state);
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <p style={{ color: 'black' }}>{`${cell.row},${cell.col}`}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const getCellColor = (state: CellState): string => {
  switch (state) {
    case CellState.Start:
      return '#4CAF50';
    case CellState.End:
      return '#FF5252';
    case CellState.Obstacle:
      return 'yellow';
    // case CellState.Empty:
    //   return 'yellow';
    default:
      return '#1e1e1e';
  }
};