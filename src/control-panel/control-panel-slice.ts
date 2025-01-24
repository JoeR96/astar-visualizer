import {StateCreator} from "zustand";
import { CellState } from '../enums.ts';

export interface ControlPanelSlice {
    activeButton: CellState;
    setSelectedButtonState: (buttonState: CellState) => void;
    canTravelDiagonally: boolean;
    setCanTravelDiagonally: (canTravelDiagonally: boolean) => void;
}

export const createControlPanelSlice: StateCreator<
  ControlPanelSlice,
  [],
  [],
  ControlPanelSlice
> = (set) => ({
    activeButton: CellState.Start,
    setSelectedButtonState: (buttonState: CellState) => set({ activeButton: buttonState }),
    canTravelDiagonally: true,
    setCanTravelDiagonally: (canTravelDiagonally: boolean) => set({ canTravelDiagonally }),
});

