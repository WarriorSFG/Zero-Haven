import React from 'react';
import { useHorror } from '../../context/HorrorContext';
import './AnomalyToast.css';

const DIFFICULTY_COLORS = {
  obvious: '#d4a000',
  subtle:  '#8b0000',
  hidden:  '#00aa44',
};

const DIFFICULTY_LABELS = {
  obvious: '// OBVIOUS',
  subtle:  '// SUBTLE',
  hidden:  '// HIDDEN',
};

const AnomalyToast = () => {
  const { anomalyToastVisible, lastFoundAnomaly, foundAnomalies, totalAnomalies } = useHorror();

  if (!lastFoundAnomaly) return null;

  const color = DIFFICULTY_COLORS[lastFoundAnomaly.difficulty] || '#888';
  const diffLabel = DIFFICULTY_LABELS[lastFoundAnomaly.difficulty] || '// ???';

  return (
    <div className={`anomaly-toast ${anomalyToastVisible ? 'toast-visible' : 'toast-hidden'}`}>
      <div className="toast-left-bar" style={{ background: color }} />
      <div className="toast-body">
        <div className="toast-header">
          <span className="toast-tag" style={{ color }}>◈ ANOMALY DETECTED</span>
          <span className="toast-diff" style={{ color }}>{diffLabel}</span>
        </div>
        <div className="toast-label">{lastFoundAnomaly.label}</div>
        <div className="toast-count">
          {foundAnomalies.size} / {totalAnomalies} FOUND
          <span className="toast-bar">
            <span
              className="toast-bar-fill"
              style={{ width: `${(foundAnomalies.size / totalAnomalies) * 100}%`, background: color }}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnomalyToast;
