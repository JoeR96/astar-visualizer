import { useEffect } from 'react';
import { useControlsBoundedStore } from '../BoundedStore.ts';
import { DEMO_CELLS } from './demoScene.ts';
import { getTheme } from '../themes/index.ts';
import { buildPresetScene } from '../themes/presets.ts';
import { aStar } from '../services/astarService.ts';
import { CellState } from '../enums.ts';

/** How long to hold the finished path on screen before starting over. */
const HOLD_AFTER_RUN_MS = 3000;
/** A run that produces no path at all is abandoned after this long. */
const RUN_TIMEOUT_MS = 25000;
const POLL_MS = 400;

export type DemoMode = 'off' | 'seed' | 'loop';

/**
 * Drives the unattended demo.
 *
 * Without it the component mounts as an empty grid with no start or end, which
 * gives a first-time visitor nothing to read: it looks like decoration rather
 * than a tool. 'seed' lays out a scene so there is always something to see;
 * 'loop' also runs the search on repeat.
 *
 * Any pointer or key input inside the component hands control to the visitor -
 * the loop stops for good and their grid is left alone.
 */
export const useDemoMode = (
  mode: DemoMode,
  rootRef: React.RefObject<HTMLElement>,
  /** Seed from the theme's preset maps in turn, instead of the one hand-placed scene. */
  maps = false,
) => {
  useEffect(() => {
    if (mode === 'off') return;

    const store = useControlsBoundedStore;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const wait = (ms: number) =>
      new Promise<void>(resolve => {
        timers.push(setTimeout(resolve, ms));
      });

    // A generated map with no way through would leave the loop waiting out its timeout
    // on an empty grid, so a map only plays if A* can actually reach the goal on it.
    let mapIndex = 0;
    const solvable = (scene: { row: number; col: number; state: CellState }[]) => {
      const { rows, columns, canTravelDiagonally } = store.getState();
      const grid = Array.from({ length: rows }, (_, row) =>
        Array.from({ length: columns }, (_, col) => ({ row, col, state: CellState.Empty })));
      for (const c of scene) if (grid[c.row]?.[c.col]) grid[c.row][c.col].state = c.state;
      const start = grid[0][0];
      const end = grid[rows - 1][columns - 1];
      return aStar(grid, start, end, canTravelDiagonally).path.length > 0;
    };

    const seed = () => {
      const state = store.getState();
      if (maps) {
        const presets = getTheme(state.visualTheme).presets;
        for (let tries = 0; tries < presets.length * 3; tries++) {
          const id = presets[mapIndex++ % presets.length].id;
          const scene = buildPresetScene(id, state.rows, state.columns, state.visualTheme);
          if (scene.length > 0 && solvable(scene)) {
            state.applyScene(scene);
            return;
          }
        }
      }
      state.applyScene([...DEMO_CELLS]);
    };

    /**
     * Resolves once the run stops producing new path nodes, or it times out.
     * Bails immediately if another run started, so a reset never leaves this
     * waiting on a run that no longer exists.
     */
    const waitForRunToSettle = async (runId: number) => {
      const startedAt = Date.now();
      let lastPathLength = -1;
      let stablePolls = 0;

      while (!cancelled && Date.now() - startedAt < RUN_TIMEOUT_MS) {
        await wait(POLL_MS);
        if (cancelled) return;
        const { path, runId: currentRun } = store.getState();
        if (currentRun !== runId) return;
        if (path.length === lastPathLength) {
          // Only treat a settled grid as finished once something was actually found.
          if (path.length > 0 && ++stablePolls >= 2) return;
        } else {
          stablePolls = 0;
          lastPathLength = path.length;
        }
      }
    };

    const run = async () => {
      seed();
      if (mode === 'seed') return;

      // Let the seeded scene register before the search starts moving.
      await wait(1200);

      while (!cancelled) {
        store.getState().handleFindPath(store.getState().canTravelDiagonally);
        await waitForRunToSettle(store.getState().runId);
        if (cancelled) return;
        await wait(HOLD_AFTER_RUN_MS);
        if (cancelled) return;
        seed();
        await wait(800);
      }
    };

    const handOver = () => {
      if (cancelled) return;
      cancelled = true;
      timers.forEach(clearTimeout);
      // Stop the in-flight animation too, so the grid is still the moment the
      // visitor touched it rather than carrying on painting under them.
      store.getState().cancelRun();
    };

    const root = rootRef.current;
    root?.addEventListener('pointerdown', handOver);
    root?.addEventListener('keydown', handOver);

    run();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      root?.removeEventListener('pointerdown', handOver);
      root?.removeEventListener('keydown', handOver);
    };
  }, [mode, rootRef, maps]);
};
