import {create} from 'zustand';
import { createGridSlice } from './Cell/grid-slice.ts';
import { createControlPanelSlice } from './ControlPanel/control-panel-slice.ts';

type BoundedStore = ReturnType<typeof createGridSlice> & ReturnType<typeof createControlPanelSlice>;

export const useControlsBoundedStore = create<BoundedStore>((set, get, api) => ({
  ...createGridSlice(set, get, api),
  ...createControlPanelSlice(set, get, api),
}));
