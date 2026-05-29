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
      { name: 'JavaScript', level: 85 },
      { name: 'React Native', level: 75 },
      { name: 'UI/UX Architecture', level: 70 },
    ],
  },
  {
    id: 'backend',
    label: 'BACKEND',
    icon: '◉',
    skills: [
      { name: 'Node.js / Express.js', level: 85 },
      { name: 'MongoDB', level: 80 },
      { name: 'SQL', level: 75 },
      { name: 'System Design', level: 70 },
    ],
  },
  {
    id: 'tools',
    label: 'TOOLS / OTHER',
    icon: '◐',
    skills: [
      { name: 'C / C++', level: 90 },
      { name: 'Python', level: 85 },
      { name: 'Microsoft Azure', level: 75 },
      { name: 'C# / Unity3D', level: 70 },
    ],
  },
];

// As horror escalates, skill bars start "draining"
const getDrainedLevel = (level, horrorLevel) => {
  if (horrorLevel < 4) return level;
  const drain = (horrorLevel - 3) * 8;
  return Math.max(5, level - drain);
};

const SkillBar = ({ name, level, horrorLevel, onClick }) => {
  const [displayed, setDisplayed] = useState(0);
  const drainedLevel = getDrainedLevel(level, horrorLevel);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayed(drainedLevel), 100);
    return () => clearTimeout(timer);
  }, [drainedLevel]);

  const isDrained = horrorLevel >= 5 && drainedLevel < level * 0.6;
  const isCritical = drainedLevel <= 15;

  return (
    <div className={`skill-row ${isCritical ? 'skill-critical' : ''}`} onClick={onClick}>
      <div className="skill-name-row">
        <span className="skill-name">
          {horrorLevel >= 7 ? '▓▓▓▓▓▓▓▓' : name}
        </span>
        <span className={`skill-pct ${isDrained ? 'drain-text' : ''}`}>
          {isDrained ? 'FAILING' : `${displayed}%`}
        </span>
      </div>
      <div className="skill-bar-track">
        <div
          className={`skill-bar-fill ${isCritical ? 'fill-critical' : isDrained ? 'fill-drain' : 'fill-normal'}`}
          style={{ width: `${displayed}%` }}
        />
      </div>
    </div>
  );
};

const SkillsSection = () => {
  const { horrorLevel, escalate } = useHorror();

  return (
    <section className="section skills-section">
      <div className="section-header">
        <span className="section-tag">// CAPABILITIES</span>
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

      <div className="skills-grid">
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
                />
              ))}
            </div>
          </div>
        ))}
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
            'Top 250 Finalist, Microsoft AI Unlocked 2026',
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
