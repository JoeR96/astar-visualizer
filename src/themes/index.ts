import { CellState, VisualTheme } from '../enums';

export interface TerrainConfig {
  name: string;
  icon: string;
  passable: boolean;
}

export interface PresetConfig {
  id: string;
  name: string;
  icon: string;
}

export interface ThemeConfig {
  id: VisualTheme;
  name: string;
  startIcon: string;
  endIcon: string;
  terrains: Partial<Record<CellState, TerrainConfig>>;
  presets: PresetConfig[];
}

export const CLASSIC_THEME: ThemeConfig = {
  id: VisualTheme.Classic,
  name: 'Classic',
  startIcon: '●',
  endIcon: '●',
  terrains: {
    [CellState.Obstacle]: { name: 'Wall', icon: '■', passable: false },
  },
  presets: [
    { id: 'random', name: 'Random', icon: '' },
    { id: 'maze', name: 'Maze', icon: '' },
  ],
};

export const MEDIEVAL_THEME: ThemeConfig = {
  id: VisualTheme.Medieval,
  name: 'Medieval',
  startIcon: '⚔️',
  endIcon: '🏰',
  terrains: {
    [CellState.Obstacle]: { name: 'Wall', icon: '🧱', passable: false },
    [CellState.Water]: { name: 'Water', icon: '🌊', passable: false },
    [CellState.Forest]: { name: 'Forest', icon: '🌲', passable: true },
    [CellState.Mountain]: { name: 'Mountain', icon: '⛰️', passable: false },
  },
  presets: [
    { id: 'river', name: 'River Crossing', icon: '' },
    { id: 'mountains', name: 'Mountain Range', icon: '' },
    { id: 'maze', name: 'Castle Maze', icon: '' },
    { id: 'random', name: 'Random Forest', icon: '' },
  ],
};

export const THEMES: Record<VisualTheme, ThemeConfig> = {
  [VisualTheme.Classic]: CLASSIC_THEME,
  [VisualTheme.Medieval]: MEDIEVAL_THEME,
};

export const getTheme = (theme: VisualTheme): ThemeConfig => THEMES[theme];

export const getTerrainTools = (theme: VisualTheme): Array<{ state: CellState; config: TerrainConfig }> => {
  const themeConfig = getTheme(theme);
  return Object.entries(themeConfig.terrains).map(([state, config]) => ({
    state: Number(state) as CellState,
    config: config as TerrainConfig,
  }));
};

export const isImpassable = (state: CellState): boolean => {
  return state === CellState.Obstacle ||
         state === CellState.Water ||
         state === CellState.Mountain;
};
