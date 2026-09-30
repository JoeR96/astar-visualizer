import { useEffect } from 'react';
import { useControlsBoundedStore } from '../BoundedStore.ts';
import { DEMO_CELLS } from './demoScene.ts';

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
 *
 * The loop also parks between runs while the component is scrolled out of view,
 * so a page that embeds it is not animating a grid nobody can see.
 */
export const useDemoMode = (mode: DemoMode, rootRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (mode === 'off') return;

    const store = useControlsBoundedStore;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const wait = (ms: number) =>
      new Promise<void>(resolve => {
        timers.push(setTimeout(resolve, ms));
      });

    const seed = () => {
      store.getState().applyScene([...DEMO_CELLS]);
    };

    // Assume visible until told otherwise: the observer reports within a frame of
    // mounting, well before the first run, and without one (an old browser, a test
    // environment) the loop behaves as it always has.
    let visible = true;
    let resumeWhenVisible: (() => void) | null = null;
    const root = rootRef.current;
    const observer =
      root && typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(entries => {
            visible = entries[entries.length - 1].isIntersecting;
            if (visible) {
              resumeWhenVisible?.();
              resumeWhenVisible = null;
            }
          })
        : null;
    if (root) observer?.observe(root);

    /** Resolves at once on screen; off screen, when the component next scrolls into view. */
    const untilVisible = () =>
      visible ? Promise.resolve() : new Promise<void>(resolve => { resumeWhenVisible = resolve; });

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
        await untilVisible();
        if (cancelled) return;
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

    root?.addEventListener('pointerdown', handOver);
    root?.addEventListener('keydown', handOver);

    run();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      observer?.disconnect();
      root?.removeEventListener('pointerdown', handOver);
      root?.removeEventListener('keydown', handOver);
    };
  }, [mode, rootRef]);
};
