import React from 'react';
import { useHorror } from '../context/HorrorContext';
import './SubliminalLayer.css';

/**
 * SubliminalLayer — renders above everything else.
 * Handles:
 *  1. Flash scary images (sub-100ms, subliminal)
 *  2. Scary text messages that bleed in
 */
const SCARY_MESSAGES = [
  "IT KNOWS YOU'RE HERE",
  "DON'T SCROLL",
  "LEAVE NOW",
  "IT'S BEHIND YOU",
  "YOU WERE WARNED",
  "FOUND YOU",
];

const SubliminalLayer = () => {
  const { flashImage, scaryTextVisible } = useHorror();

  const msg = SCARY_MESSAGES[Math.floor(Math.random() * SCARY_MESSAGES.length)];

  return (
    <>
      {/* Subliminal image flash */}
      {flashImage && (
        <div className="subliminal-flash" aria-hidden="true">
          <img src={flashImage} alt="" draggable={false} />
        </div>
      )}

      {/* Bleeding scary text */}
      {scaryTextVisible && (
        <div className="subliminal-text" aria-hidden="true">
          {msg}
        </div>
      )}
    </>
  );
};

export default SubliminalLayer;
