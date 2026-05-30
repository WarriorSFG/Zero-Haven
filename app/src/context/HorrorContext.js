import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

const HorrorContext = createContext(null);

// Scary subliminal image files in /public/assets/
const SCARY_IMAGES = [
  '/assets/scary1.jpg',
  '/assets/scary2.jpg',
  '/assets/scary3.jpg',
];

export const HorrorProvider = ({ children }) => {
  const [horrorLevel, setHorrorLevel] = useState(0);       // 0–10 scale
  const [isJumpscare, setIsJumpscare] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [flashImage, setFlashImage] = useState(null);       // path to scary img
  const [scaryTextVisible, setScaryTextVisible] = useState(false);
  const [phase, setPhase] = useState(1);                    // 1, 2, or 3
  const [corruptedCursor, setCorruptedCursor] = useState(false);

  const bgAudioRef = useRef(null);
  const sfxRef = useRef(null);
  const scareAudioRef = useRef(null);
  const interactionCount = useRef(0);

  const triggerGlitch = useCallback((duration = 300) => {
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), duration);
  }, []);

  const flashScaryImage = useCallback(() => {
    const img = SCARY_IMAGES[Math.floor(Math.random() * SCARY_IMAGES.length)];
    setFlashImage(img);
    setTimeout(() => setFlashImage(null), 120 + Math.random() * 200); // 80–200ms flash
  }, []);

  const playSFX = useCallback((src) => {
    if (sfxRef.current) {
      sfxRef.current.pause();
      sfxRef.current.currentTime = 0;
      sfxRef.current.src = src;
      sfxRef.current.play().catch(() => {});
    }
  }, []);

  const executeJumpscare = useCallback(() => {
    if (isJumpscare) return;
    setIsJumpscare(true);
    setPhase(3);
    if (bgAudioRef.current) bgAudioRef.current.pause();
    if (scareAudioRef.current) {
      scareAudioRef.current.play().catch(() => {});
    }
  }, [isJumpscare]);

  // Called on every significant user interaction
  const escalate = useCallback(() => {
    interactionCount.current += 1;
    const count = interactionCount.current;

    playSFX('/assets/ui-click.mp3');

    const newLevel = Math.min(10, Math.floor(count / 5));
    setHorrorLevel(newLevel);

    // Phase transitions
    if (count >= 1 && phase === 1) setPhase(2);
    
    // Trigger the final jumpscare (which handles setting phase to 3 internally)
    if (count >= 30) {
      executeJumpscare();
    }

    // Escalation events spaced out to fit the new 30-interaction timeline
    if (count === 5) {
      triggerGlitch(200);
      playSFX('/assets/wet-crawl.mp3');
    }
    if (count === 10) {
      flashScaryImage();
    }
    if (count === 15) {
      triggerGlitch(500);
      playSFX('/assets/wet-crawl.mp3');
    }
    if (count === 20) {
      flashScaryImage();
      setCorruptedCursor(true);
    }
    if (count === 25) {
      triggerGlitch(800);
      setScaryTextVisible(true);
      setTimeout(() => setScaryTextVisible(false), 2000);
    }

    // Random chance events above level 4
    if (newLevel >= 4) {
      if (Math.random() < 0.15) flashScaryImage();
      if (Math.random() < 0.10) triggerGlitch(150);
    }
  }, [phase, triggerGlitch, flashScaryImage, playSFX, executeJumpscare]);

  const startAmbientAudio = useCallback(() => {
    if (bgAudioRef.current && bgAudioRef.current.paused) {
      bgAudioRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <HorrorContext.Provider value={{
      horrorLevel,
      isJumpscare,
      glitchActive,
      flashImage,
      scaryTextVisible,
      phase,
      corruptedCursor,
      bgAudioRef,
      sfxRef,
      scareAudioRef,
      escalate,
      triggerGlitch,
      flashScaryImage,
      playSFX,
      startAmbientAudio,
      executeJumpscare,
    }}>
      {children}
    </HorrorContext.Provider>
  );
};

export const useHorror = () => {
  const ctx = useContext(HorrorContext);
  if (!ctx) throw new Error('useHorror must be used inside HorrorProvider');
  return ctx;
};
