import { StateCreator } from 'zustand';
import { VisualTheme } from '../enums';

export interface ThemeSlice {
  visualTheme: VisualTheme;
  showCosts: boolean;
  setVisualTheme: (theme: VisualTheme) => void;
  setShowCosts: (show: boolean) => void;
}

export const createThemeSlice: StateCreator<ThemeSlice, [], [], ThemeSlice> = (set) => ({
  visualTheme: VisualTheme.Medieval,
  showCosts: false,
  setVisualTheme: (theme: VisualTheme) => set({ visualTheme: theme }),
  setShowCosts: (show: boolean) => set({ showCosts: show }),
});
