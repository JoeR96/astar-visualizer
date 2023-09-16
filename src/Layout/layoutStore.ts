import create from 'zustand';
import { TileState } from '../enums/TileStates';

const useLayoutStore = create((set) => ({
  activeButton: TileState.NORMAL,
  setActiveButton: (state: TileState) => set({ activeButton: state }),
}));

export default useLayoutStore;
