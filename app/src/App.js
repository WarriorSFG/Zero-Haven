import React, { useEffect } from 'react';
import { HorrorProvider, useHorror } from './context/HorrorContext';
import PhaseOne from './components/PhaseOne';
import PhaseTwo from './components/PhaseTwo';
import PhaseThree from './components/PhaseThree';
import SubliminalLayer from './components/SubliminalLayer';
import AudioEngine from './components/AudioEngine';
import './App.css';

const AppInner = () => {
  const { phase, corruptedCursor, startAmbientAudio } = useHorror();

  useEffect(() => {
    const handler = () => startAmbientAudio();
    document.addEventListener('click', handler, { once: true });
    return () => document.removeEventListener('click', handler);
  }, [startAmbientAudio]);

  return (
    <div className={`App ${corruptedCursor ? 'cursor-corrupt' : ''}`}>
      <AudioEngine />
      <SubliminalLayer />

      {phase === 1 && <PhaseOne />}
      {phase === 2 && <PhaseTwo />}
      {phase === 3 && <PhaseThree />}
    </div>
  );
};

const App = () => (
  <HorrorProvider>
    <AppInner />
  </HorrorProvider>
);

export default App;
