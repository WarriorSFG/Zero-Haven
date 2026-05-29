import { useState, useEffect, useRef } from 'react';
import './PhaseOne.css';

const PhaseOne = () => {
  const [horrorLevel, setHorrorLevel] = useState(0);
  const [isJumpscare, setIsJumpscare] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  
  const bgAudioRef = useRef(null);
  const sfxRef = useRef(null);
  const scareAudioRef = useRef(null);

  // Initialize ambient audio on first click
  useEffect(() => {
    const startAudio = () => {
      if (bgAudioRef.current && bgAudioRef.current.paused) {
        bgAudioRef.current.play().catch(() => {});
      }
    };
    document.addEventListener('click', startAudio, { once: true });
    return () => document.removeEventListener('click', startAudio);
  }, []);

  const triggerGlitch = () => {
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 300); // 300ms visual glitch
  };

  const handleNavClick = (section) => {
    if (isJumpscare) return; // Prevent clicks during the scare

    if (section === 'contact') {
      executeJumpscare();
      return;
    }

    // Escalate the horror level on normal clicks
    const newLevel = horrorLevel + 1;
    setHorrorLevel(newLevel);
    triggerGlitch();

    // Phase 2: The environment reacts
    if (newLevel === 2) {
      if (sfxRef.current) {
        sfxRef.current.src = "/assets/wet-crawl.mp3";
        sfxRef.current.play();
      }
      // Corrupt the UI slightly
      document.body.style.filter = "contrast(150%) saturate(50%)";
    }
  };

  const executeJumpscare = () => {
    setIsJumpscare(true);
    
    // Kill background audio, play the scream
    if (bgAudioRef.current) bgAudioRef.current.pause();
    if (scareAudioRef.current) scareAudioRef.current.play();

    // After the scare video finishes (assume 2.5 seconds), go to a "broken" state
    setTimeout(() => {
      window.location.href = "mailto:your-email@example.com"; // Actually open contact
      document.body.innerHTML = "<div style='color:red; font-family:monospace; font-size:2rem; text-align:center; margin-top:20vh;'>SYSTEM FAILURE // CONNECTION SEVERED</div>";
    }, 2500); 
  };

  const navItems = [
    { label: 'SYS_DATA // About', id: 'about' },
    { label: 'ARCHIVES // Projects', id: 'projects' },
    { label: 'CAPABILITIES // Skills', id: 'skills' },
    { label: 'TERMINAL // Contact', id: 'contact' }
  ];

  return (
    <div className={`phase-one-container ${glitchActive ? 'severe-glitch' : ''}`}>
      {/* Audio Players */}
      <audio ref={bgAudioRef} loop src="/assets/room-tone.mp3" />
      <audio ref={sfxRef} />
      <audio ref={scareAudioRef} src="/assets/scream.mp3" />

      {/* The Jumpscare Layer (Hidden until triggered) */}
      {isJumpscare && (
        <div className="jumpscare-layer">
          <video autoPlay muted playsInline>
            <source src="/assets/jumpscare.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      {/* Normal Background */}
      <div className="video-background">
        <video autoPlay loop muted playsInline>
          <source src="/assets/empty-well.mp4" type="video/mp4" />
        </video>
        <div className={`murky-overlay ${horrorLevel >= 2 ? 'darker-murk' : ''}`}></div>
      </div>

      {/* Terminal UI */}
      <main className="portfolio-content">
        <header className="terminal-header">
          <h1 className="glitch-text" data-text={horrorLevel >= 2 ? "IT_SEES_YOU" : "ANOMALY_DETECTED"}>
            {horrorLevel >= 2 ? "IT_SEES_YOU" : "ANOMALY_DETECTED"}
          </h1>
        </header>

        <nav className="terminal-nav">
          {navItems.map((item) => (
            <button 
              key={item.id} 
              className={`nav-btn ${item.id === 'contact' && horrorLevel >= 1 ? 'red-warning' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="btn-text">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>

      <div className="crt-overlay"></div>
      <div className="vignette"></div>
    </div>
  );
};

export default PhaseOne;