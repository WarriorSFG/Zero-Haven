import React, { useEffect, useState, useRef } from 'react';
import { useHorror, ANOMALY_REGISTRY } from '../context/HorrorContext';
import './PhaseThree.css';

const GLITCH_MESSAGES = [
  'SYSTEM FAILURE',
  'CONNECTION SEVERED',
  'YOU WERE WARNED',
  'IT FOUND YOU',
  'NOWHERE LEFT TO RUN',
  'SIGNAL_LOST',
  'NULL_NULL_NULL',
  '▓▓▓▓▓▓▓▓▓▓▓▓',
];

const SCORE_TIERS = [
  { min: 10, label: 'NOTHING ESCAPES YOU',  color: '#00cc44', desc: 'You see what others miss. Perfect anomaly hunter.' },
  { min: 7,  label: 'SHARP EYES',           color: '#d4a000', desc: 'You caught most of it. The darkness respects you.' },
  { min: 4,  label: 'CURIOUS OBSERVER',     color: '#888',    desc: 'You looked, but some things hid in plain sight.' },
  { min: 1,  label: 'OBLIVIOUS',            color: '#555',    desc: 'You wandered through the dark without looking.' },
  { min: 0,  label: 'COMPLETELY BLIND',     color: '#333',    desc: 'You saw nothing. It saw everything.' },
];

const getScoreTier = (count) =>
  SCORE_TIERS.find((t) => count >= t.min) || SCORE_TIERS[SCORE_TIERS.length - 1];

const DIFFICULTY_COLORS = {
  obvious: '#d4a000',
  subtle:  '#8b4040',
  hidden:  '#00aa44',
};

const PhaseThree = () => {
  const { foundAnomalies, totalAnomalies } = useHorror();

  const [stage, setStage]               = useState('video');
  const [msgIndex, setMsgIndex]         = useState(0);
  const [showContact, setShowContact]   = useState(false);
  const [showScore, setShowScore]       = useState(false);
  const [textLines, setTextLines]       = useState([]);
  const videoRef = useRef(null);

  const foundCount = foundAnomalies.size;
  const tier = getScoreTier(foundCount);

  // Stage 1 → Stage 2 after 8.1s
  useEffect(() => {
    const timer = setTimeout(() => setStage('broken'), 8100);
    return () => clearTimeout(timer);
  }, []);

  // Type out lines
  useEffect(() => {
    if (stage !== 'broken') return;

    const lines = [
      '> SYSTEM_INTEGRITY: 0%',
      '> CONTAINMENT_STATUS: FAILED',
      '> ANOMALY_DETECTED: CRITICAL',
      '> ALL PERSONNEL: EVACUATE',
      '> ...',
      '> ...',
      '> SUBJECT_IDENTIFIED.',
      '> TRANSMISSION_ORIGIN: YOUR DEVICE',
      '> LOCATION: LOGGED.',
      '> ...',
      '> BUT WAIT.',
      '> THIS IS JUST A PORTFOLIO.',
      '> YOU MADE IT TO THE END.',
      '> ...',
      '> GOOD.',
      '> NOW YOU KNOW WHAT I CAN DO.',
      '> ─────────────────────────────',
      '> IF YOU WANT SOMEONE WHO BUILDS',
      '> EXPERIENCES PEOPLE NEVER FORGET,',
      '> YOU KNOW WHERE TO FIND ME.',
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i >= lines.length) {
        clearInterval(interval);
        setTimeout(() => setShowContact(true), 600);
        setTimeout(() => setShowScore(true), 1000);
        return;
      }
      setTextLines((prev) => [...prev, lines[i]]);
      i++;
    }, 220);

    return () => clearInterval(interval);
  }, [stage]);

  // Rotate glitch message
  useEffect(() => {
    if (stage !== 'broken') return;
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % GLITCH_MESSAGES.length);
    }, 600);
    return () => clearInterval(interval);
  }, [stage]);

  return (
    <div className="p3-container">
      {/* ── Stage 1: Jumpscare Video ── */}
      {stage === 'video' && (
        <div className="p3-jumpscare">
          <video ref={videoRef} autoPlay playsInline className="p3-scare-video">
            <source src="/assets/jumpscare.mp4" type="video/mp4" />
          </video>
          <div className="p3-flash-ring" />
        </div>
      )}

      {/* ── Stage 2: Broken System Terminal ── */}
      {stage === 'broken' && (
        <div className="p3-broken">
          <div className="p3-glitch-header">
            <h1 className="p3-main-title" data-text={GLITCH_MESSAGES[msgIndex]}>
              {GLITCH_MESSAGES[msgIndex]}
            </h1>
            <div className="p3-divider" />
          </div>

          {/* Typewriter terminal */}
          <div className="p3-terminal">
            <div className="p3-term-body">
              {textLines.filter((l) => typeof l === 'string').map((line, i) => (
                <div
                  key={i}
                  className={`p3-term-line
                    ${line.startsWith('> ─') ? 'p3-divider-line' : ''}
                    ${line.includes('JUST A PORTFOLIO') || line.includes('YOU MADE IT') ? 'p3-reveal-line' : ''}
                    ${line.includes('NOW YOU KNOW') || line.includes('EXPERIENCES') || line.includes('YOU KNOW WHERE') ? 'p3-pitch-line' : ''}
                  `}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {line}
                </div>
              ))}
              {textLines.length > 0 && !showContact && (
                <span className="p3-cursor">█</span>
              )}
            </div>
          </div>

          {/* ── ANOMALY SCORE PANEL ── */}
          {showScore && (
            <div className="p3-score-panel">
              <div className="p3-score-eyebrow">{"// ANOMALY_DETECTION_REPORT"}</div>

              <div className="p3-score-main">
                <div className="p3-score-fraction" style={{ color: tier.color }}>
                  <span className="p3-score-num">{foundCount}</span>
                  <span className="p3-score-sep">/</span>
                  <span className="p3-score-total">{totalAnomalies}</span>
                </div>
                <div className="p3-score-meta">
                  <div className="p3-score-tier" style={{ color: tier.color }}>{tier.label}</div>
                  <div className="p3-score-desc">{tier.desc}</div>
                </div>
              </div>

              {/* Breakdown grid */}
              <div className="p3-score-grid">
                {ANOMALY_REGISTRY.map((anomaly) => {
                  const found = foundAnomalies.has(anomaly.id);
                  const col = DIFFICULTY_COLORS[anomaly.difficulty] || '#555';
                  return (
                    <div
                      key={anomaly.id}
                      className={`p3-score-row ${found ? 'score-row-found' : 'score-row-missed'}`}
                    >
                      <span className="p3-score-check" style={{ color: found ? col : '#2a2a2a' }}>
                        {found ? '◈' : '○'}
                      </span>
                      <span className="p3-score-item-label" style={{ color: found ? '#999' : '#333' }}>
                        {found ? anomaly.label : (anomaly.hint || '???')}
                      </span>
                      <span
                        className="p3-score-diff"
                        style={{ color: found ? col : '#222' }}
                      >
                        {anomaly.difficulty}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Final CTA */}
          {showContact && (
            <div className="p3-cta">
              <div className="p3-cta-inner">
                <div className="p3-cta-eyebrow">{`// END_TRANSMISSION`}</div>
                <div className="p3-cta-name">Samarth Gupta</div>
                <div className="p3-cta-role">Software Engineer — AVAILABLE FOR HIRE</div>
                <div className="p3-cta-links">
                  <a href="mailto:samarthgupta9999@gmail.com" className="p3-cta-btn primary">
                    {`▶ OPEN CHANNEL // Email`}
                  </a>
                  <a href="https://github.com/WarriorSFG" className="p3-cta-btn" target="_blank" rel="noreferrer">
                    ▶ GitHub
                  </a>
                  <a href="https://linkedin.com/in/samarthgupta9999" className="p3-cta-btn" target="_blank" rel="noreferrer">
                    ▶ LinkedIn
                  </a>
                </div>
                <button className="p3-restart" onClick={() => window.location.reload()}>
                  ↺ RESTART SEQUENCE
                </button>
              </div>
            </div>
          )}

          <div className="p3-noise" aria-hidden="true" />
        </div>
      )}
    </div>
  );
};

export default PhaseThree;
