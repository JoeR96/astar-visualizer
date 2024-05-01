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
  const { activeButton, setActiveButton } = useLayoutStore();
  const { cells, setCell, start, end } = useGridStore();

  const handleCellClick = (row: number, col: number) => {
    const currentCellState = getCellState(row, col);

    switch (activeButton) {
      case ButtonState.START:
        if (start) {
          setCell(start.row, start.col, TileState.NORMAL);
        }
        setCell(row, col, ButtonState.START);
        setActiveButton(ButtonState.END); // Automatically switch to 'End' after setting 'Start'
        break;
      case ButtonState.END:
        if (end) {
          setCell(end.row, end.col, TileState.NORMAL);
        }
        setCell(row, col, ButtonState.END);
        setActiveButton(ButtonState.OBSTACLE); // Automatically switch to 'Obstacle' after setting 'End'
        break;
      case ButtonState.OBSTACLE:
        setCell(row, col, ButtonState.OBSTACLE); // Just set the obstacle, stay on setting obstacles
        break;
      default:
        setCell(row, col, currentCellState === TileState.NORMAL ? activeButton : TileState.NORMAL);
        break;
    }
  };

  return (
    <div className="grid">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="row">
          {Array.from({ length: cols }).map((_, colIndex) => {
            const cellState = getCellState(rowIndex, colIndex);
            return (
              <motion.div
                key={colIndex}
                data-testid={`cell-${rowIndex}-${colIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.1 * rowIndex + 0.01 * colIndex }}
                className={`cell ${cellState.toLowerCase()}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

const getCellState = (row: number, col: number) => {
  const { cells } = useGridStore.getState();
  const cell = cells.find(c => c.row === row && c.col === col);
  return cell ? cell.state : TileState.NORMAL;
};
