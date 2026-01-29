import {create} from 'zustand';
import { createGridSlice } from './grid/grid-slice.ts';
import { createControlPanelSlice } from './control-panel/control-panel-slice.ts';
import { createThemeSlice } from './themes/theme-slice.ts';
import { createSimulationSlice, SimulationSlice } from './simulation/simulation-slice.ts';

type BoundedStore = ReturnType<typeof createGridSlice> & ReturnType<typeof createControlPanelSlice> & ReturnType<typeof createThemeSlice> & SimulationSlice;

export const useControlsBoundedStore = create<BoundedStore>((set, get, api) => ({
  ...createGridSlice(set, get, api),
  ...createControlPanelSlice(set, get, api),
  ...createThemeSlice(set, get, api),
  ...createSimulationSlice(set, get, api),
}));
