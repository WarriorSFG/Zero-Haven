import React, { useEffect, useState, useRef } from 'react';
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

const PhaseThree = () => {
  const [stage, setStage] = useState('video');   // 'video' → 'broken'
  const [msgIndex, setMsgIndex] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [textLines, setTextLines] = useState([]);
  const videoRef = useRef(null);

  // Stage 1: play jumpscare video for 2.5s, then transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setStage('broken');
    }, 8100);
    return () => clearTimeout(timer);
  }, []);

  // Stage 2: type out the broken-system text line by line
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
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="p3-scare-video"
          >
            <source src="/assets/jumpscare.mp4" type="video/mp4" />
          </video>
          <div className="p3-flash-ring" />
        </div>
      )}

      {/* ── Stage 2: Broken System Terminal ── */}
      {stage === 'broken' && (
        <div className="p3-broken">
          {/* Spinning glitch header */}
          <div className="p3-glitch-header">
            <h1
              className="p3-main-title"
              data-text={GLITCH_MESSAGES[msgIndex]}
            >
              {GLITCH_MESSAGES[msgIndex]}
            </h1>
            <div className="p3-divider" />
          </div>

          {/* Typewriter terminal */}
          <div className="p3-terminal">
            <div className="p3-term-body">
              {textLines.filter((line) => typeof line === "string").map((line, i) => (
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
              {/* blinking cursor */}
              {textLines.length > 0 && !showContact && (
                <span className="p3-cursor">█</span>
              )}
            </div>
          </div>

          {/* Final CTA — revealed last */}
          {showContact && (
            <div className="p3-cta">
              <div className="p3-cta-inner">
                <div className="p3-cta-eyebrow">// END_TRANSMISSION</div>
                <div className="p3-cta-name">Samarth Gupta</div>
                <div className="p3-cta-role">Software Engineer — AVAILABLE FOR HIRE</div>
                <div className="p3-cta-links">
                  <a href="mailto:samarthgupta9999@gmail.com" className="p3-cta-btn primary">
                    ▶ OPEN CHANNEL // Email
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

          {/* Noise overlay */}
          <div className="p3-noise" aria-hidden="true" />
        </div>
      )}
    </div>
  );
};

export default PhaseThree;
