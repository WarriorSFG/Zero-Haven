import React, { useState, useEffect, useRef } from 'react';
import { useHorror } from '../context/HorrorContext';
import CRTOverlay from './CRTOverlay';
import AnomalyToast from './ui/AnomalyToast';
import AboutSection from './sections/AboutSection';
import ProjectsSection from './sections/ProjectsSection';
import SkillsSection from './sections/SkillsSection';
import ContactSection from './sections/ContactSection';
import ExperienceSection from './sections/ExperienceSection';
import './PhaseTwo.css';

const NAV_ITEMS = [
  { id: 'about',      label: 'SYS_DATA',     sub: 'About'      },
  { id: 'projects',   label: 'ARCHIVES',     sub: 'Projects'   },
  { id: 'skills',     label: 'CAPABILITIES', sub: 'Skills'     },
  { id: 'experience', label: 'HISTORY',      sub: 'Experience' },
  { id: 'contact',    label: 'OPEN_CHANNEL', sub: 'Contact'    },
];

const CORRUPTED_LABELS = {
  about:      'WHO_ARE_YOU',
  projects:   'YOUR_WORK_IS_MINE',
  skills:     'USELESS',
  experience: 'YOUR_MEMORY_IS_MINE',
  contact:    '▓▓▓▓▓▓▓▓',
};

// Anomaly score badge shown in sidebar
const AnomalyScoreBadge = () => {
  const { foundAnomalies, totalAnomalies } = useHorror();
  const count = foundAnomalies.size;
  const pct   = Math.round((count / totalAnomalies) * 100);

  const color = count === 0
    ? '#2a2a2a'
    : count < 4
    ? '#555'
    : count < 8
    ? '#d4a000'
    : 'var(--blood-bright)';

  return (
    <div className="p2-anomaly-score" style={{ borderColor: color }}>
      <div className="anomaly-score-header">
        <span className="anomaly-score-tag" style={{ color }}>◈ ANOMALIES DETECTED</span>
        <span className="anomaly-score-val" style={{ color }}>
          {count.toString().padStart(2, '0')}/{totalAnomalies.toString().padStart(2, '0')}
        </span>
      </div>
      <div className="anomaly-score-bar">
        <div
          className="anomaly-score-fill"
          style={{ width: `${pct}%`, background: color, boxShadow: count > 0 ? `0 0 6px ${color}` : 'none' }}
        />
      </div>
      <div className="anomaly-score-label" style={{ color: count > 0 ? '#333' : '#1a1a1a' }}>
        {count === 0
          ? 'NOTHING FOUND YET'
          : count < 4
          ? 'SEARCHING...'
          : count < 8
          ? 'GOOD EYE'
          : count < totalAnomalies
          ? 'ALMOST THERE'
          : '// ALL ANOMALIES FOUND'}
      </div>
    </div>
  );
};

const PhaseTwo = () => {
  const [activeSection, setActiveSection] = useState('about');
  const { horrorLevel, glitchActive, escalate, flashScaryImage } = useHorror();
  const containerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (horrorLevel >= 4 && Math.random() < 0.2) {
        flashScaryImage();
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [horrorLevel, flashScaryImage]);

  const handleNavClick = (id) => {
    setActiveSection(id);
    escalate(id);
  };

  const getLabel = (item) => {
    if (horrorLevel >= 6) return CORRUPTED_LABELS[item.id];
    if (horrorLevel >= 3 && item.id === 'contact') return '▓▒░ ' + item.label;
    return item.label;
  };

  return (
    <div
      ref={containerRef}
      className={`p2-container ${glitchActive ? 'severe-glitch' : ''} horror-lvl-${Math.min(horrorLevel, 7)}`}
    >
      <div className="p2-bg" />

      {/* Sidebar Navigation */}
      <aside className="p2-sidebar">
        <div className="p2-logo">
          <span className="logo-bracket">{'{ '}</span>
          <span className="logo-name">Samarth</span>
          <span className="logo-bracket">{' }'}</span>
        </div>

        <div className="p2-system-status">
          <span className="status-dot" />
          {horrorLevel < 4 ? 'SYSTEM ONLINE' : 'CONTAINMENT FAILING'}
        </div>

        <nav className="p2-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`p2-nav-btn
                ${activeSection === item.id ? 'active' : ''}
                ${item.id === 'contact' && horrorLevel >= 3 ? 'danger' : ''}
              `}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="nav-icon">
                {activeSection === item.id ? '▶' : '○'}
              </span>
              <span className="nav-label">{getLabel(item)}</span>
              <span className="nav-sub">{`// ${item.sub}`}</span>
            </button>
          ))}
        </nav>

        {/* Anomaly detection score */}
        <AnomalyScoreBadge />

        <div className="p2-horror-meter">
          <div className="meter-label">ANOMALY LEVEL</div>
          <div className="meter-bar">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`meter-cell
                  ${i < horrorLevel ? 'filled' : ''}
                  ${i >= 7 ? 'critical' : i >= 4 ? 'warning' : ''}
                `}
              />
            ))}
          </div>
          <div className="meter-val">{horrorLevel.toString().padStart(2, '0')}/10</div>
        </div>

        <div className="p2-sidebar-footer">
          UNAUTHORIZED ACCESS DETECTED<br />
          LOG #{Math.floor(Math.random() * 9999).toString().padStart(4, '0')}
        </div>
      </aside>

      {/* Main content area */}
      <main className="p2-main">
        <div className="p2-topbar">
          <span className="topbar-path">
            ~/portfolio/{activeSection}
            {horrorLevel >= 5 && (
              <span className="topbar-warning">{" // IT IS WATCHING"}</span>
            )}
          </span>
          <span className="topbar-clock">
            {new Date().toLocaleTimeString('en-GB', { hour12: false })}
          </span>
        </div>

        <div className="p2-section-wrap">
          {activeSection === 'about'      && <AboutSection />}
          {activeSection === 'projects'   && <ProjectsSection />}
          {activeSection === 'skills'     && <SkillsSection />}
          {activeSection === 'contact'    && <ContactSection />}
          {activeSection === 'experience' && <ExperienceSection />}
        </div>
      </main>

      {/* Anomaly discovered toast */}
      <AnomalyToast />

      <CRTOverlay intensity={0.8 + horrorLevel * 0.08} />
    </div>
  );
};

export default PhaseTwo;
