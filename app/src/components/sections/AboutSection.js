import React, { useState } from 'react';
import { useHorror } from '../../context/HorrorContext';
import './Section.css';

// ─── ANOMALY 1: "about_terminal_dot"
//   The terminal title bar has FOUR dots, not three.
//   The fourth one is a dark, barely-visible crimson — wrong color.
//   Clicking it reveals the anomaly.
//
// ─── ANOMALY 2: "about_wrong_year"
//   The stat card "EXPERIENCE" shows "2 YEARS" — but all listed
//   experience entries started in 2025 at earliest. Clicking
//   the card flags it as found.

const AboutSection = () => {
  const { horrorLevel, escalate, discoverAnomaly, foundAnomalies } = useHorror();
  const [dotClicked, setDotClicked] = useState(false);

  const Links = [
    { label: 'GitHub',     href: 'https://github.com/WarriorSFG' },
    { label: 'LinkedIn',   href: 'https://linkedin.com/in/samarthgupta9999' },
    { label: 'Codeforces', href: 'https://codeforces.com/profile/WarriorSFG' },
    { label: 'Dribbble',   href: 'https://dribbble.com/samarthgupta' },
  ];

  const corruptedBio = horrorLevel >= 6
    ? "SUBJECT CANNOT BE DESCRIBED. DATA CORRUPTED. IT KNOWS YOUR NAME."
    : null;

  const handleFourthDotClick = (e) => {
    e.stopPropagation();
    if (!dotClicked) {
      setDotClicked(true);
      discoverAnomaly('about_terminal_dot');
    }
  };

  const handleExperienceStatClick = () => {
    escalate('stat');
    discoverAnomaly('about_wrong_year');
  };

  return (
    <section className="section about-section">
      <div className="section-header">
        <span className="section-tag">{"// SYS_DATA"}</span>
        <h2 className="section-title">
          {horrorLevel >= 5 ? 'WHO_AM_I_NOW' : 'ABOUT'}
        </h2>
        <div className="section-divider" />
      </div>

      <div className="about-grid">
        {/* Terminal-style bio block */}
        <div className="about-terminal">
          <div className="term-titlebar">
            <span className="term-dot red" />
            <span className="term-dot yellow" />
            <span className="term-dot green" />

            {/* ── ANOMALY 1: Fourth dot, dark crimson ── */}
            <span
              className={`term-dot anomaly-dot ${dotClicked ? 'anomaly-dot-found' : ''}`}
              title={dotClicked ? '// ANOMALY LOGGED' : undefined}
              onClick={handleFourthDotClick}
              style={{
                background: dotClicked ? '#8b0000' : '#1a0000',
                boxShadow: dotClicked ? '0 0 6px #8b0000' : 'none',
                cursor: 'pointer',
                transition: 'background 0.3s, box-shadow 0.3s',
              }}
            />

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
                  Hello. I'm <strong>Samarth Gupta</strong> — a{' '}
                  <strong>Software Developer</strong> based in{' '}
                  <strong>Mumbai, India</strong>.
                </>
              )}
            </p>
            <p className="term-output" style={{ marginTop: '1rem' }}>
              {horrorLevel < 4
                ? 'I am a B.Tech ECE student at IIT Guwahati specializing in full-stack web applications, AI integrations, and Web3 architectures. I actively engage in competitive programming with a strong foundation in C++ data structures and algorithms, constantly seeking to push the limits of performance and system design. Also an important thing you should know is...'
                : '▓▒░ SIGNAL DEGRADED ░▒▓  [PARTIAL DATA RECOVERED]  I hate visitors...'}
            </p>
            {horrorLevel >= 2 && (
              <p className="term-output corrupted-line" style={{ marginTop: '0.5rem' }}>
                {"// ANOMALY NOTE: subject is aware they are being observed"}
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
            { label: 'DESIGNATION', value: 'Software Engineer', id: 'designation' },
            { label: 'LOCATION',    value: 'Mumbai, India',     id: 'location'    },
            {
              // ── ANOMALY 2: "2 YEARS" — suspicious, all jobs started ≥2025 ──
              label: 'EXPERIENCE',
              value: '2 YEARS',
              id: 'experience',
              anomaly: true,
            },
            {
              label: 'STATUS',
              value: horrorLevel >= 5 ? 'COMPROMISED' : 'AVAILABLE',
              id: 'status',
            },
          ].map((stat) => (
            <div
              key={stat.id}
              className={`stat-card
                ${stat.label === 'STATUS' && horrorLevel >= 5 ? 'danger-card' : ''}
                ${stat.anomaly && !foundAnomalies.has('about_wrong_year') ? 'anomaly-card-hint' : ''}
                ${stat.anomaly && foundAnomalies.has('about_wrong_year') ? 'anomaly-card-found' : ''}
              `}
              onClick={stat.anomaly ? handleExperienceStatClick : () => escalate('stat')}
              title={stat.anomaly && !foundAnomalies.has('about_wrong_year')
                ? 'Something seems off...'
                : undefined}
            >
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="about-links">
        {Links.map((link, i) => (
          <a
            key={i}
            href={link.href}
            className="about-link"
            onClick={(e) => { e.preventDefault(); escalate('link'); }}
          >
            <span className="link-arrow">→</span> {link.label}
          </a>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
