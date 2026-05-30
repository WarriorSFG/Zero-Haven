import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

const HorrorContext = createContext(null);

// Scary subliminal image files in /public/assets/
const SCARY_IMAGES = [
  '/assets/scary1.jpg',
  '/assets/scary2.jpg',
  '/assets/scary3.jpg',
];

// ─────────────────────────────────────────────────────────────
//  ANOMALY REGISTRY
//  Each anomaly has: id, section, label, difficulty, hint
//  difficulty: 'obvious' | 'subtle' | 'hidden'
// ─────────────────────────────────────────────────────────────
export const ANOMALY_REGISTRY = [
  // ABOUT section
  {
    id: 'about_terminal_dot',
    section: 'about',
    label: 'A fourth terminal dot — wrong color',
    difficulty: 'subtle',
    hint: 'Terminal windows only have three dots...',
  },
  {
    id: 'about_wrong_year',
    section: 'about',
    label: 'Experience: "2 YEARS" but founded only months ago',
    difficulty: 'hidden',
    hint: 'The numbers don\'t add up if you think about them.',
  },

  // PROJECTS section
  {
    id: 'projects_wrong_id',
    section: 'projects',
    label: 'Project #004 shows ID #000',
    difficulty: 'subtle',
    hint: 'Check the project numbers in the top-right corner of each card.',
  },
  {
    id: 'projects_phantom_tag',
    section: 'projects',
    label: 'A tag that says "HELP_ME" on project #6',
    difficulty: 'obvious',
    hint: 'Look closely at the technology tags.',
  },

  // SKILLS section
  {
    id: 'skills_impossible_level',
    section: 'skills',
    label: 'A skill bar filled to 101%',
    difficulty: 'obvious',
    hint: 'Something about the percentages seems... wrong.',
  },
  {
    id: 'skills_ghost_category',
    section: 'skills',
    label: 'A ghost skill category that keeps disappearing',
    difficulty: 'subtle',
    hint: 'Is there a fourth column? Or are your eyes playing tricks?',
  },

  // EXPERIENCE section
  {
    id: 'experience_overlap',
    section: 'experience',
    label: 'Two jobs have overlapping dates',
    difficulty: 'hidden',
    hint: 'Look carefully at the date ranges. Can someone be in two places at once?',
  },
  {
    id: 'experience_phantom_entry',
    section: 'experience',
    label: 'A fifth entry that wasn\'t there before',
    difficulty: 'subtle',
    hint: 'Count the timeline entries. Scroll all the way down.',
  },

  // CONTACT section
  {
    id: 'contact_wrong_email',
    section: 'contact',
    label: 'The displayed email has an extra character',
    difficulty: 'subtle',
    hint: 'Read the email address very carefully, character by character.',
  },
  {
    id: 'contact_hidden_message',
    section: 'contact',
    label: 'A hidden message in the lore block — visible from the start',
    difficulty: 'hidden',
    hint: 'The LOG_ENTRY block appears earlier than you think.',
  },
];

export const HorrorProvider = ({ children }) => {
  const [horrorLevel, setHorrorLevel] = useState(0);       // 0–10 scale
  const [isJumpscare, setIsJumpscare] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [flashImage, setFlashImage] = useState(null);       // path to scary img
  const [scaryTextVisible, setScaryTextVisible] = useState(false);
  const [phase, setPhase] = useState(1);                    // 1, 2, or 3
  const [corruptedCursor, setCorruptedCursor] = useState(false);

  // ── Anomaly tracking ──
  const [foundAnomalies, setFoundAnomalies] = useState(new Set());
  const [lastFoundAnomaly, setLastFoundAnomaly] = useState(null); // for toast notification
  const [anomalyToastVisible, setAnomalyToastVisible] = useState(false);
  const anomalyToastTimer = useRef(null);

  const bgAudioRef    = useRef(null);
  const sfxRef        = useRef(null);
  const scareAudioRef = useRef(null);
  const interactionCount = useRef(0);

  // ── Anomaly discovery ──
  const discoverAnomaly = useCallback((anomalyId) => {
    setFoundAnomalies(prev => {
      if (prev.has(anomalyId)) return prev; // already found
      const next = new Set(prev);
      next.add(anomalyId);

      const meta = ANOMALY_REGISTRY.find(a => a.id === anomalyId);
      setLastFoundAnomaly(meta || { id: anomalyId, label: anomalyId });
      setAnomalyToastVisible(true);

      // Clear old timer
      if (anomalyToastTimer.current) clearTimeout(anomalyToastTimer.current);
      anomalyToastTimer.current = setTimeout(() => setAnomalyToastVisible(false), 3200);

      return next;
    });
  }, []);

  const triggerGlitch = useCallback((duration = 300) => {
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), duration);
  }, []);

  const flashScaryImage = useCallback(() => {
    const img = SCARY_IMAGES[Math.floor(Math.random() * SCARY_IMAGES.length)];
    setFlashImage(img);
    setTimeout(() => setFlashImage(null), 120 + Math.random() * 200);
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

    if (count >= 1 && phase === 1) setPhase(2);

    if (count >= 30) {
      executeJumpscare();
    }

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
      // Anomaly system
      foundAnomalies,
      lastFoundAnomaly,
      anomalyToastVisible,
      discoverAnomaly,
      totalAnomalies: ANOMALY_REGISTRY.length,
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
