import React from 'react';
import './Layout.css';
import { Grid } from '../Grid/Grid';
import { Button } from '../Button/Button';
import useLayoutStore from './layoutStore';
import useGridStore from '../Grid/GridStore';
import { ButtonState, TileState } from '../enums/TileStates.ts';

export const Layout: React.FC = () => {
  const { activeButton, setActiveButton } = useLayoutStore();
  const { resetAllCells } = useGridStore();
  const { rows, cols } = useGridStore();

  return (
    <div className="layout">
      <Grid rows={rows} cols={cols} />

      <div className="button-row">
        <Button
          label="Toggle start tile"
          width="150px"
          onClick={() => setActiveButton(ButtonState.START)}
          style={{
            backgroundColor: activeButton === TileState.START ? 'gray' : 'initial',
          }}
        />
        <Button
          label="Toggle end tile"
          width="150px"
          onClick={() => setActiveButton(ButtonState.END)}
          style={{
            backgroundColor: activeButton === TileState.END ? 'gray' : 'initial',
          }}
        />
        <Button
          label="Toggle obstacle"
          width="150px"
          onClick={() => setActiveButton(ButtonState.OBSTACLE)}
          style={{
            backgroundColor: activeButton === TileState.OBSTACLE ? 'gray' : 'initial',
          }}
        />
        <Button
          label="Toggle Reset Tile"
          width="150px"
          onClick={() => setActiveButton(ButtonState.RESETTILE)}
          style={{
            backgroundColor: activeButton === ButtonState.RESET ? 'gray' : 'initial',
          }}
        />
        <Button
          label="Reset Grid"
          width="150px"
          onClick={() => {
            setActiveButton(TileState.NORMAL);
            resetAllCells();
          }}
          style={{
            backgroundColor: activeButton === ButtonState.RESET ? 'gray' : 'initial',
          }}
        />
        <Button
          label="Find Path"
          width="150px"
          onClick={() => findPath()}
          style={{
            backgroundColor: activeButton === TileState.NORMAL ? 'gray' : 'initial',
          }}
        />
      </div>
    </div>
  );
};
