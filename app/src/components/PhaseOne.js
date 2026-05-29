import React, { useEffect } from 'react';
import { useHorror } from '../context/HorrorContext';
import CRTOverlay from './CRTOverlay';
import './PhaseOne.css';

const PhaseOne = () => {
  const { horrorLevel, glitchActive, escalate } = useHorror();

  const navItems = [
    { label: '> SYS_DATA      // About',       id: 'about' },
    { label: '> ARCHIVES      // Projects',    id: 'projects' },
    { label: '> CAPABILITIES  // Skills',      id: 'skills' },
    { label: '> OPEN_CHANNEL  // Contact',     id: 'contact' },
  ];

  return (
    <div className={`phase-one-container ${glitchActive ? 'severe-glitch' : ''}`}>
      {/* Background Video */}
      <div className="video-background">
        <video autoPlay loop muted playsInline>
          <source src="/assets/empty-well.mp4" type="video/mp4" />
        </video>
        <div className={`murky-overlay ${horrorLevel >= 3 ? 'darker-murk' : ''}`} />
      </div>

      {/* Main UI */}
      <main className="p1-content">
        <div className="p1-eyebrow">[ SIGNAL DETECTED // STAND BY ]</div>

        <h1
          className="p1-title glitch-text"
          data-text={horrorLevel >= 3 ? 'IT_SEES_YOU' : 'ANOMALY_DETECTED'}
        >
          {horrorLevel >= 3 ? 'IT_SEES_YOU' : 'ANOMALY_DETECTED'}
        </h1>

        <p className="p1-subtitle">
          {horrorLevel >= 3
            ? '// YOU SHOULD NOT HAVE COME HERE'
            : '// UNAUTHORIZED ACCESS IN PROGRESS'}
        </p>

        <nav className="p1-nav" aria-label="Portfolio navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`p1-btn ${item.id === 'contact' && horrorLevel >= 2 ? 'red-warning' : ''}`}
              onClick={() => escalate(item.id)}
            >
              <span className="btn-bracket">[</span>
              <span className="btn-text">{item.label}</span>
              <span className="btn-bracket">]</span>
            </button>
          ))}
        </nav>

        <div className="p1-footer">
          {horrorLevel === 0
            ? 'SELECT A NODE TO BEGIN'
            : `WARNING LEVEL: ${horrorLevel.toString().padStart(2,'0')} // CONTAINMENT FAILING`}
        </div>
      </main>

      <CRTOverlay intensity={1 + horrorLevel * 0.1} />
    </div>
  );
};

export default PhaseOne;
