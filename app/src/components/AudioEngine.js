import React from 'react';
import { useHorror } from '../context/HorrorContext';

/**
 * AudioEngine — invisible component that mounts all audio elements
 * and wires them to the HorrorContext refs.
 */
const AudioEngine = () => {
  const { bgAudioRef, sfxRef, scareAudioRef } = useHorror();

  return (
    <>
      {/* Looping ambient drone */}
      <audio
        ref={bgAudioRef}
        loop
        preload="auto"
        style={{ display: 'none' }}
      >
        <source src="/assets/room-tone.mp3" type="audio/mpeg" />
      </audio>

      {/* One-shot SFX (src is set dynamically) */}
      <audio
        ref={sfxRef}
        preload="none"
        style={{ display: 'none' }}
      />

      {/* Jumpscare scream */}
      <audio
        ref={scareAudioRef}
        preload="auto"
        style={{ display: 'none' }}
      >
        <source src="/assets/scream.mp3" type="audio/mpeg" />
      </audio>
    </>
  );
};

export default AudioEngine;
