// Grid.tsx
import React from 'react';
import './Grid.css';
import { ButtonState, TileState } from '../enums/TileStates';
import useGridStore from './GridStore';
import useLayoutStore from '../Layout/layoutStore';
import { motion } from 'framer-motion';

interface Props {
  rows: number;
  cols: number;
}

export const Grid: React.FC<Props> = ({ rows, cols }) => {
  const { activeButton } = useLayoutStore();
  const { cells, setCell, version, start, end } = useGridStore();

  const getCellState = (row: number, col: number): TileState => {
    const cell = cells.find(c => c.row === row && c.col === col);
    return cell ? cell.state : TileState.NORMAL;
  };

  const handleCellClick = (row: number, col: number) => {
    if (activeButton === ButtonState.RESETTILE) {
        const currentState = getCellState(row, col);
        
        if (currentState === TileState.START || currentState === TileState.END) {
            setCell(row, col, TileState.NORMAL);
        } else {
            setCell(row, col, TileState.NORMAL);
        }
    } else {
        if (activeButton === ButtonState.START && start) {
            setCell(start.row, start.col, TileState.NORMAL);
        } else if (activeButton === ButtonState.END && end) {
            setCell(end.row, end.col, TileState.NORMAL);
        }

        setCell(row, col, activeButton);
    }
};


return (
  <div className="grid" key={version}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="row">
              {Array.from({ length: cols }).map((_, colIndex) => {
                  const cellState = getCellState(rowIndex, colIndex);
                  const cellOrder = cells.find(
                      (c) => c.row === rowIndex && c.col === colIndex
                  )?.order;

                  return (
                      <div
                          key={colIndex}
                          data-testid={`cell-${rowIndex}-${colIndex}`}
                          initial={{ opacity: 0 }}
                          animate={{
                              opacity: 1,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: cellOrder * 0.1 }}
                          className={`cell ${
                              cellState === TileState.START
                                  ? 'start'
                                  : cellState === TileState.END
                                  ? 'end'
                                  : cellState === TileState.OBSTACLE
                                  ? 'obstacle'
                                  : cellState === TileState.PATH
                                  ? 'path'
                                  : 'normal'
                          }`}
                          onClick={() => handleCellClick(rowIndex, colIndex)}
                      >
                          {cellState === TileState.PATH && (
                              <div className="path-number">
                                  {getCellPathNumber(rowIndex, colIndex)}
                              </div>
                          )}
                      </div>
                  );
              })}
          </div>
      ))}
  </div>
);

};

const getCellPathNumber = (row: number, col: number) => {
  const { path } = useGridStore.getState();
  const cellInPath = path.find(cell => cell.row === row && cell.col === col);
  if (cellInPath) {
    const pathNumber = path.indexOf(cellInPath) + 1;
    console.log(`Path number for cell (${row}, ${col}): ${pathNumber}`);
    return pathNumber;
  }
  return null;
};
