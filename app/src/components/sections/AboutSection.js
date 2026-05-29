import React from 'react';
import { useHorror } from '../../context/HorrorContext';
import './Section.css';

const AboutSection = () => {
  const { horrorLevel, escalate } = useHorror();

  const corruptedBio = horrorLevel >= 6
    ? "SUBJECT CANNOT BE DESCRIBED. DATA CORRUPTED. IT KNOWS YOUR NAME."
    : null;

  return (
    <section className="section about-section">
      <div className="section-header">
        <span className="section-tag">// SYS_DATA</span>
        <h2 className="section-title">
          {horrorLevel >= 5 ? 'WHO_AM_I_NOW' : 'ABOUT'}
        </h2>
        <div className="section-divider" />
      </div>

      <div className="about-grid">
        {/* Terminal-style bio block */}
        <div className="about-terminal">
          <div className="term-titlebar">
            <span className="term-dot red" /><span className="term-dot yellow" /><span className="term-dot green" />
            <span className="term-title">bio.txt</span>
          </div>
          <div className="term-body">
            <p className="term-line">
              <span className="term-prompt">root@anomaly:~$ </span>
              <span className="term-cmd">cat bio.txt</span>
            </p>
            <p className="term-output">
              {corruptedBio || (
                <>
                  Hello. I'm <strong>[YOUR_NAME]</strong> — a <strong>[YOUR_ROLE]</strong> based in <strong>[YOUR_CITY]</strong>.
                </>
              )}
            </p>
            <p className="term-output" style={{ marginTop: '1rem' }}>
              {horrorLevel < 4
                ? '[INSERT PERSONAL BIO / DESCRIPTION HERE. Talk about your passion, background, and what drives you. 2–3 sentences works well here.]'
                : '▓▒░ SIGNAL DEGRADED ░▒▓  [PARTIAL DATA RECOVERED]  [INSERT BIO FRAGMENT]'}
            </p>
            {horrorLevel >= 2 && (
              <p className="term-output corrupted-line" style={{ marginTop: '0.5rem' }}>
                // ANOMALY NOTE: subject is aware they are being observed
              </p>
            )}
            <p className="term-line blink-cursor">
              <span className="term-prompt">root@anomaly:~$ </span>
              <span className="term-cursor">█</span>
            </p>
          </div>
        </div>

        {/* Stats / info cards */}
        <div className="about-stats">
          {[
            { label: 'DESIGNATION', value: '[YOUR_ROLE]' },
            { label: 'LOCATION',    value: '[YOUR_CITY]' },
            { label: 'EXPERIENCE',  value: '[X] YEARS' },
            { label: 'STATUS',      value: horrorLevel >= 5 ? 'COMPROMISED' : 'AVAILABLE' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`stat-card ${stat.label === 'STATUS' && horrorLevel >= 5 ? 'danger-card' : ''}`}
              onClick={() => escalate('stat')}
            >
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="about-links">
        {['GitHub', 'LinkedIn', 'Resume (PDF)', 'Dribbble'].map((link, i) => (
          <a
            key={i}
            href="#"
            className="about-link"
            onClick={(e) => { e.preventDefault(); escalate('link'); }}
          >
            <span className="link-arrow">→</span> {link}
          </a>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
