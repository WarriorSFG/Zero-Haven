import React from 'react';
import './CRTOverlay.css';

/**
 * CRTOverlay — scanlines, vignette, and static noise.
 * Drop this on top of any phase.
 */
const CRTOverlay = ({ intensity = 1 }) => (
  <div className="crt-root" style={{ '--crt-intensity': intensity }} aria-hidden="true">
    <div className="crt-scanlines" />
    <div className="crt-noise" />
    <div className="crt-vignette" />
    <div className="crt-flicker" />
  </div>
);

export default CRTOverlay;
