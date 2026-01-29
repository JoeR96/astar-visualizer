import React from 'react';
import { useControlsBoundedStore } from '../BoundedStore';
import './stats-panel.css';

export const StatsPanel: React.FC = () => {
  const { currentRun, isAnimating, visitedNodes, path } = useControlsBoundedStore();

  // Show live stats during animation, or final stats after completion
  const nodesExplored = currentRun?.nodesExplored ?? visitedNodes.length;
  const pathLength = currentRun?.pathLength ?? path.length;
  const efficiency = pathLength > 0 && nodesExplored > 0
    ? ((pathLength / nodesExplored) * 100).toFixed(1)
    : null;
  const executionTime = currentRun?.executionTimeMs?.toFixed(0) ?? null;

  // Don't show if no data
  if (nodesExplored === 0 && pathLength === 0 && !isAnimating) {
    return null;
  }

  return (
    <div className="stats-panel">
      <div className="stats-container">
        <div className="stat-item">
          <span className="stat-label">Nodes Explored</span>
          <span className="stat-value">{nodesExplored}</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-label">Path Length</span>
          <span className="stat-value">{pathLength > 0 ? pathLength : '—'}</span>
        </div>
        {efficiency && (
          <>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-label">Efficiency</span>
              <span className="stat-value">{efficiency}%</span>
            </div>
          </>
        )}
        {executionTime && (
          <>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-label">Time</span>
              <span className="stat-value">{executionTime}ms</span>
            </div>
          </>
        )}
        {isAnimating && (
          <>
            <div className="stat-divider" />
            <div className="stat-item status">
              <span className="stat-status animating">Running...</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
