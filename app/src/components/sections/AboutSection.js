import React from 'react';
import { useHorror } from '../../context/HorrorContext';
import './Section.css';

const AboutSection = () => {
  const { horrorLevel, escalate } = useHorror();
  const Links = [
    { label: 'GitHub', href: 'https://github.com/WarriorSFG' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/samarthgupta9999' },
    { label: 'Codeforces', href: 'https://codeforces.com/profile/WarriorSFG' },
    { label: 'Dribbble', href: 'https://dribbble.com/samarthgupta' },
  ];
  const corruptedBio = horrorLevel >= 6
    ? "SUBJECT CANNOT BE DESCRIBED. DATA CORRUPTED. IT KNOWS YOUR NAME."
    : null;

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
                  Hello. I'm <strong>Samarth Gupta</strong> — a <strong>Software Developer</strong> based in <strong>Mumbai, India</strong>.
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
            { label: 'DESIGNATION', value: 'Software Engineer' },
            { label: 'LOCATION',    value: 'Mumbai, India' },
            { label: 'EXPERIENCE',  value: '2 YEARS' },
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
