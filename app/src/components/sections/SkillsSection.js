import React, { useState, useEffect } from 'react';
import { useHorror } from '../../context/HorrorContext';
import './Section.css';

const SKILL_CATEGORIES = [
  {
    id: 'frontend',
    label: 'FRONTEND',
    icon: '◈',
    skills: [
      { name: 'React.js / Next.js', level: 90 },
      { name: 'JavaScript',         level: 85 },
      { name: 'React Native',       level: 75 },
      { name: 'UI/UX Architecture', level: 70 },
    ],
  },
  {
    id: 'backend',
    label: 'BACKEND',
    icon: '◉',
    skills: [
      { name: 'Node.js / Express.js', level: 85 },
      { name: 'MongoDB',              level: 80 },
      { name: 'SQL',                  level: 75 },
      { name: 'System Design',        level: 70 },
    ],
  },
  {
    id: 'tools',
    label: 'TOOLS / OTHER',
    icon: '◐',
    skills: [
      { name: 'C / C++',       level: 90 },
      { name: 'Python',        level: 85 },
      // ── ANOMALY 1: "Microsoft Azure" shows 101% ──
      { name: 'Microsoft Azure', level: 101, anomaly: 'skills_impossible_level' },
      { name: 'C# / Unity3D', level: 70 },
    ],
  },
];

// As horror escalates, skill bars start "draining"
const getDrainedLevel = (level, horrorLevel) => {
  if (level > 100) return level; // anomaly bar never drains — always suspicious
  if (horrorLevel < 4) return level;
  const drain = (horrorLevel - 3) * 8;
  return Math.max(5, level - drain);
};

const SkillBar = ({ name, level, horrorLevel, onClick, anomalyId, onAnomalyClick, foundAnomalies }) => {
  const [displayed, setDisplayed] = useState(0);
  const drainedLevel = getDrainedLevel(level, horrorLevel);
  const isAnomalyBar = !!anomalyId;
  const isFound = isAnomalyBar && foundAnomalies.has(anomalyId);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayed(drainedLevel), 100);
    return () => clearTimeout(timer);
  }, [drainedLevel]);

  const isDrained  = horrorLevel >= 5 && drainedLevel < level * 0.6 && !isAnomalyBar;
  const isCritical = drainedLevel <= 15 && !isAnomalyBar;

  const handleClick = () => {
    if (isAnomalyBar) {
      onAnomalyClick(anomalyId);
    }
    onClick();
  };

  return (
    <div
      className={`skill-row
        ${isCritical ? 'skill-critical' : ''}
        ${isAnomalyBar && !isFound ? 'anomaly-bar-hint' : ''}
        ${isAnomalyBar && isFound ? 'anomaly-bar-found' : ''}
      `}
      onClick={handleClick}
      title={isAnomalyBar && !isFound ? 'That percentage looks... wrong' : undefined}
    >
      <div className="skill-name-row">
        <span className="skill-name">
          {horrorLevel >= 7 ? '▓▓▓▓▓▓▓▓' : name}
        </span>
        <span className={`skill-pct ${isDrained ? 'drain-text' : ''} ${isAnomalyBar ? 'anomaly-pct' : ''}`}>
          {isDrained ? 'FAILING' : `${displayed}%`}
        </span>
      </div>
      <div className="skill-bar-track">
        <div
          className={`skill-bar-fill
            ${isCritical ? 'fill-critical' : isDrained ? 'fill-drain' : 'fill-normal'}
            ${isAnomalyBar ? 'fill-anomaly' : ''}
          `}
          // Cap visual width at 100% but the number shown is 101%
          style={{ width: `${Math.min(displayed, 100)}%` }}
        />
        {/* Overflow indicator for 101% */}
        {isAnomalyBar && displayed >= 100 && (
          <div className="skill-bar-overflow" />
        )}
      </div>
    </div>
  );
};

// ── ANOMALY 2: Ghost category — flickers into view briefly ──
const GhostCategory = ({ onDiscover, isFound }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Appears ~4s in, stays for 2.5s, then vanishes
    const showTimer = setTimeout(() => {
      setVisible(true);
      const hideTimer = setTimeout(() => setVisible(false), 2500);
      return () => clearTimeout(hideTimer);
    }, 4000);

    // Then reappear briefly every 18 seconds
    const interval = setInterval(() => {
      setVisible(true);
      setTimeout(() => setVisible(false), 1800);
    }, 18000);

    return () => { clearTimeout(showTimer); clearInterval(interval); };
  }, []);

  return (
    <div
      className={`skill-category ghost-category ${visible ? 'ghost-visible' : 'ghost-hidden'} ${isFound ? 'ghost-found' : ''}`}
      onClick={() => { if (visible) onDiscover('skills_ghost_category'); }}
      title={visible && !isFound ? 'Click it before it disappears...' : undefined}
    >
      <div className="skill-cat-header">
        <span className="skill-cat-icon" style={{ color: '#440000' }}>◫</span>
        <span className="skill-cat-label" style={{ color: '#2a0000' }}>UNKNOWN</span>
      </div>
      <div className="skill-list">
        {['▓▓▓▓▓▓▓', '▒▒▒▒▒▒▒', '░░░░░░░'].map((s, i) => (
          <div key={i} className="skill-row">
            <div className="skill-name-row">
              <span className="skill-name" style={{ color: '#330000' }}>{s}</span>
              <span className="skill-pct" style={{ color: '#220000' }}>??%</span>
            </div>
            <div className="skill-bar-track">
              <div className="skill-bar-fill fill-drain" style={{ width: `${30 + i * 20}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SkillsSection = () => {
  const { horrorLevel, escalate, discoverAnomaly, foundAnomalies } = useHorror();

  return (
    <section className="section skills-section">
      <div className="section-header">
        <span className="section-tag">{"// CAPABILITIES"}</span>
        <h2 className="section-title">
          {horrorLevel >= 6 ? 'WHAT_REMAINS' : 'SKILLS'}
        </h2>
        <div className="section-divider" />
      </div>

      {horrorLevel >= 5 && (
        <div className="skills-warning-banner">
          ⚠ CAPABILITY DEGRADATION IN PROGRESS — ANOMALY SPREADING
        </div>
      )}

      <div className="skills-grid skills-grid-ghost">
        {SKILL_CATEGORIES.map((cat) => (
          <div key={cat.id} className="skill-category">
            <div className="skill-cat-header">
              <span className="skill-cat-icon">{cat.icon}</span>
              <span className="skill-cat-label">{cat.label}</span>
            </div>
            <div className="skill-list">
              {cat.skills.map((skill, i) => (
                <SkillBar
                  key={i}
                  name={skill.name}
                  level={skill.level}
                  horrorLevel={horrorLevel}
                  onClick={() => escalate('skill')}
                  anomalyId={skill.anomaly || null}
                  onAnomalyClick={discoverAnomaly}
                  foundAnomalies={foundAnomalies}
                />
              ))}
            </div>
          </div>
        ))}

        {/* ── ANOMALY 2: Ghost fourth column ── */}
        <GhostCategory
          onDiscover={discoverAnomaly}
          isFound={foundAnomalies.has('skills_ghost_category')}
        />
      </div>

      {/* Extra certifications / misc */}
      <div className="skills-extras">
        <div className="extras-header">OTHER NOTES</div>
        <div className="extras-list">
          {[
            'All India Rank 2126, JEE Advanced',
            '99.6%ile JEE Mains',
            '99.96%ile MHCET',
            'Codeforces Specialist (Max Rating: 1415)',
            'Atlassian Fasttrack Finalist (Top 27 Candidates)',
            'Top 24 Finalist, Tech-A-Bit, BIT Meshra Hackathon',
            'Stage 2 Candidate, AlgoUniversity Tech Fellowship (Top 8%)',
          ].map((item, i) => (
            <div
              key={i}
              className={`extra-item ${horrorLevel >= 6 ? 'corrupted-item' : ''}`}
              onClick={() => escalate('extra')}
            >
              <span className="extra-bullet">▸</span>
              {horrorLevel >= 6 ? '▓▒░ DATA REDACTED ░▒▓' : item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
