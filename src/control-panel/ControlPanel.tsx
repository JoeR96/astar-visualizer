import React from 'react';
import { useControlsBoundedStore } from '../BoundedStore.ts';
import { CellState } from '../enums.ts';

export const ControlPanel: React.FC = () => {
  const {
    activeButton,
    setSelectedButtonState,
    resetCells,
    rows,
    columns,
    setNumberOfRows,
    setNumberOfColumns,
    handleFindPath,
    canTravelDiagonally,
    setCanTravelDiagonally,
  } = useControlsBoundedStore();

  const buttons = [
    { label: 'Start', state: CellState.Start },
    { label: 'End', state: CellState.End },
    { label: 'Obstacle', state: CellState.Obstacle },
    { label: 'Remove Obstacle', state: CellState.Empty },
  ];

  const handleButtonClick = (buttonState: CellState) => {
    setSelectedButtonState(buttonState);
  };

  const handleResetClick = () => {
    resetCells();
    setSelectedButtonState(CellState.Start);
  };

  const handleFindPathClick = () => {
    handleFindPath(canTravelDiagonally);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: '#2e2e2e',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
      }}
    >
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={() => handleButtonClick(button.state)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor:
              activeButton === button.state ? '#4CAF50' : '#333333',
          }}
          onMouseOver={(e) => {
            if (activeButton !== button.state) {
              e.currentTarget.style.backgroundColor = '#4CAF50';
            }
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            if (activeButton !== button.state) {
              e.currentTarget.style.backgroundColor = '#333333';
            }
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {button.label}
        </button>
      ))}
      <button
        onClick={handleFindPathClick}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          backgroundColor: '#2196F3',
          transition: 'background-color 0.3s ease, transform 0.2s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#0b7dda';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#2196F3';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        Find Path
      </button>
      <button
        onClick={() => setCanTravelDiagonally(!canTravelDiagonally)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          backgroundColor: canTravelDiagonally ? '#FFC107' : '#555555',
          transition: 'background-color 0.3s ease, transform 0.2s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#FFA000';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = canTravelDiagonally ? '#FFC107' : '#555555';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {canTravelDiagonally ? 'Disable Diagonal Travel' : 'Enable Diagonal Travel'}
      </button>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginTop: '20px',
        }}
      >
        <button
          onClick={handleResetClick}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: '#FF5252',
            transition: 'background-color 0.3s ease, transform 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#FF0000';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#FF5252';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Reset Grid
        </button>
        <label
          style={{
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          Rows:
          <input
            type="number"
            value={rows}
            onChange={(e) => setNumberOfRows(Number(e.target.value))}
            min={1}
            style={{
              padding: '5px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '100%',
              marginTop: '5px',
            }}
          />
        </label>
        <label
          style={{
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          Columns:
          <input
            type="number"
            value={columns}
            onChange={(e) => setNumberOfColumns(Number(e.target.value))}
            min={1}
            style={{
              padding: '5px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '100%',
              marginTop: '5px',
            }}
          />
        </label>
      </div>
    </div>
  );
};
