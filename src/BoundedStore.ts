import {create} from 'zustand';
import { createGridSlice } from './grid/grid-slice.ts';
import { createControlPanelSlice } from './control-panel/control-panel-slice.ts';
import { createThemeSlice } from './themes/theme-slice.ts';

type BoundedStore = ReturnType<typeof createGridSlice> & ReturnType<typeof createControlPanelSlice> & ReturnType<typeof createThemeSlice>;

export const useControlsBoundedStore = create<BoundedStore>((set, get, api) => ({
  ...createGridSlice(set, get, api),
  ...createControlPanelSlice(set, get, api),
  ...createThemeSlice(set, get, api),
}));
