import { StateCreator } from 'zustand';

export interface RunStatistics {
  nodesExplored: number;
  pathLength: number;
  executionTimeMs: number;
  efficiency: number;
}

export interface SimulationSlice {
  // Run statistics
  currentRun: RunStatistics | null;

  // Animation control
  isAnimating: boolean;
  isPaused: boolean;
  animationSpeed: number;

  // Actions
  startAnimation: () => void;
  stopAnimation: () => void;
  pauseAnimation: () => void;
  resumeAnimation: () => void;
  setAnimationSpeed: (speed: number) => void;
  setCurrentRun: (stats: RunStatistics | null) => void;
  clearCurrentRun: () => void;
}

export const createSimulationSlice: StateCreator<SimulationSlice, [], [], SimulationSlice> = (set) => ({
  currentRun: null,
  isAnimating: false,
  isPaused: false,
  animationSpeed: 1,

  startAnimation: () => set({ isAnimating: true, isPaused: false }),

  stopAnimation: () => set({ isAnimating: false, isPaused: false }),

  pauseAnimation: () => set({ isPaused: true }),

  resumeAnimation: () => set({ isPaused: false }),

  setAnimationSpeed: (speed: number) => set({ animationSpeed: speed }),

  setCurrentRun: (stats: RunStatistics | null) => set({ currentRun: stats }),

  clearCurrentRun: () => set({ currentRun: null }),
});
