import React, { useState, useEffect, useRef } from 'react';
import './howtoplay.css';

// ── In-universe briefing lines, typed out one by one ──
const BRIEFING_LINES = [
  { text: '> LOADING BRIEFING_FILE_7731.enc',       delay: 0,    type: 'cmd'     },
  { text: '> DECRYPTION: IN PROGRESS...',           delay: 380,  type: 'cmd'     },
  { text: '> ...',                                  delay: 700,  type: 'gap'     },
  { text: '> BRIEFING DECRYPTED. PROCEED.',         delay: 1050, type: 'cmd'     },
  { text: '─────────────────────────────────────',  delay: 1300, type: 'divider' },
  { text: 'SUBJECT: YOU',                           delay: 1500, type: 'header'  },
  { text: 'CLEARANCE: UNAUTHORIZED',               delay: 1650, type: 'header'  },
  { text: 'MISSION: EXPLORE THE SYSTEM.',          delay: 1850, type: 'body'    },
  { text: '─────────────────────────────────────',  delay: 2050, type: 'divider' },
  { text: '// WHAT YOU ARE DOING',                  delay: 2200, type: 'section' },
  { text: 'You are navigating a compromised',       delay: 2380, type: 'body'    },
  { text: 'portfolio system. Browse each section.', delay: 2530, type: 'body'    },
  { text: 'Click anything that seems wrong.',       delay: 2680, type: 'body'    },
  { text: '─────────────────────────────────────',  delay: 2880, type: 'divider' },
  { text: '// ANOMALY DETECTION',                   delay: 3030, type: 'section' },
  { text: 'Each section hides 1–2 anomalies.',      delay: 3180, type: 'body'    },
  { text: 'Some are obvious. Others are not.',      delay: 3330, type: 'body'    },
  { text: 'Your score is tracked in real-time.',    delay: 3480, type: 'body'    },
  { text: '10 total. Can you find them all?',       delay: 3630, type: 'body'    },
  { text: '─────────────────────────────────────',  delay: 3830, type: 'divider' },
  { text: '// WARNING',                             delay: 3980, type: 'section' },
  { text: 'Every interaction escalates the system.',delay: 4130, type: 'body'    },
  { text: '▓▒░ [SECTION REDACTED] ░▒▓',            delay: 4280, type: 'redact'  },
  { text: 'You cannot stop what comes next.',       delay: 4430, type: 'body'    },
  { text: '─────────────────────────────────────',  delay: 4630, type: 'divider' },
  { text: '> AWAITING ACKNOWLEDGEMENT...',          delay: 4830, type: 'cmd'     },
];

const HowToPlay = ({ onDismiss }) => {
  const [visibleLines, setVisibleLines]   = useState([]);
  const [showButton, setShowButton]       = useState(false);
  const [buttonReady, setButtonReady]     = useState(false);
  const [exiting, setExiting]             = useState(false);
  const [scanPos, setScanPos]             = useState(0);
  const terminalRef = useRef(null);
  const timers = useRef([]);

// Schedule each line to appear
  useEffect(() => {
    // 1. Copy the ref to a local variable inside the effect
    const activeTimers = timers.current;

    BRIEFING_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines(prev => [...prev, { ...line, index: i }]);
        // Auto-scroll terminal
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, line.delay);
      activeTimers.push(t); // Use the local variable
    });

    // Show button shortly after last line
    const btnTimer = setTimeout(() => {
      setShowButton(true);
      setTimeout(() => setButtonReady(true), 200);
    }, BRIEFING_LINES[BRIEFING_LINES.length - 1].delay + 600);
    
    activeTimers.push(btnTimer); // Use the local variable

    // 2. Use the local variable in the cleanup function
    return () => activeTimers.forEach(clearTimeout);
  }, []);

  // Scan line animation
  useEffect(() => {
    const id = setInterval(() => {
      setScanPos(p => (p + 1) % 100);
    }, 20);
    return () => clearInterval(id);
  }, []);

  // Auto-scroll as lines appear
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [visibleLines]);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(onDismiss, 600);
  };

  const getLineClass = (type) => {
    switch (type) {
      case 'cmd':     return 'htp-line-cmd';
      case 'divider': return 'htp-line-divider';
      case 'header':  return 'htp-line-header';
      case 'section': return 'htp-line-section';
      case 'redact':  return 'htp-line-redact';
      case 'gap':     return 'htp-line-gap';
      default:        return 'htp-line-body';
    }
  };

  return (
    <div className={`htp-overlay ${exiting ? 'htp-exiting' : ''}`}>
      {/* Animated scan line */}
      <div className="htp-scan" style={{ top: `${scanPos}%` }} />

      {/* Noise grain */}
      <div className="htp-noise" aria-hidden="true" />

      {/* Modal */}
      <div className={`htp-modal ${exiting ? 'htp-modal-exit' : ''}`}>

        {/* Title bar */}
        <div className="htp-titlebar">
          <div className="htp-titlebar-dots">
            <span className="htp-dot htp-dot-red" />
            <span className="htp-dot htp-dot-dark" />
            <span className="htp-dot htp-dot-dark" />
          </div>
          <span className="htp-titlebar-label">BRIEFING_7731.enc</span>
          <span className="htp-titlebar-status">
            <span className="htp-status-blink" />
            DECRYPTING
          </span>
        </div>

        {/* Terminal body */}
        <div className="htp-terminal" ref={terminalRef}>
          <div className="htp-terminal-inner">
            {visibleLines.map((line) => (
              <div
                key={line.index}
                className={`htp-line ${getLineClass(line.type)}`}
                style={{ animationDelay: '0s' }}
              >
                {line.type === 'redact' ? (
                  <span className="htp-redacted">{line.text}</span>
                ) : (
                  line.text
                )}
              </div>
            ))}

            {/* Blinking cursor at end */}
            {!showButton && visibleLines.length > 0 && (
              <span className="htp-cursor">█</span>
            )}
          </div>
        </div>

        {/* Footer with CTA */}
        <div className={`htp-footer ${showButton ? 'htp-footer-visible' : ''}`}>
          <div className="htp-footer-hint">
            {"// 10 anomalies hidden across 5 sections"}
          </div>
          <button
            className={`htp-btn ${buttonReady ? 'htp-btn-ready' : ''}`}
            onClick={handleDismiss}
            disabled={!buttonReady}
          >
            <span className="htp-btn-bracket">[</span>
            <span className="htp-btn-text">ACKNOWLEDGE &amp; PROCEED</span>
            <span className="htp-btn-bracket">]</span>
            <span className="htp-btn-arrow"> →</span>
          </button>
          <button className="htp-skip" onClick={handleDismiss}>
            {"// skip briefing"}
          </button>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="htp-corner htp-corner-tl" />
      <div className="htp-corner htp-corner-tr" />
      <div className="htp-corner htp-corner-bl" />
      <div className="htp-corner htp-corner-br" />
    </div>
  );
};

export default HowToPlay;