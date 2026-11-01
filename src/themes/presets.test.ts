import { describe, expect, it } from 'vitest';
import { buildPresetScene } from './presets';
import { CellState, VisualTheme } from '../enums';
import { getTheme } from './index';

describe('buildPresetScene', () => {
  it.each([VisualTheme.Medieval, VisualTheme.Classic])('gives every %s preset a start and goal in the corners', theme => {
    for (const { id } of getTheme(theme).presets) {
      const scene = buildPresetScene(id, 12, 22, theme);
      expect(scene.find(c => c.state === CellState.Start)).toEqual({ row: 0, col: 0, state: CellState.Start });
      expect(scene.find(c => c.state === CellState.End)).toEqual({ row: 11, col: 21, state: CellState.End });
      expect(scene.every(c => c.row >= 0 && c.row < 12 && c.col >= 0 && c.col < 22)).toBe(true);
    }
  });

  it('returns nothing for a preset the theme does not have', () => {
    expect(buildPresetScene('river', 8, 12, VisualTheme.Classic)).toEqual([]);
  });
});
