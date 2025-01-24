import {create} from 'zustand';
import { createGridSlice } from './cell/grid-slice.ts';
import { createControlPanelSlice } from './control-panel/control-panel-slice.ts';

type BoundedStore = ReturnType<typeof createGridSlice> & ReturnType<typeof createControlPanelSlice>;

export const useControlsBoundedStore = create<BoundedStore>((set, get, api) => ({
  ...createGridSlice(set, get, api),
  ...createControlPanelSlice(set, get, api),
}));
