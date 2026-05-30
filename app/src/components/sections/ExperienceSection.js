import React, { useState } from 'react';
import { useHorror } from '../../context/HorrorContext';
import './Section.css';

const EXPERIENCES = [
  {
    id: 'aiaxom',
    company: 'AIAXOM',
    role: 'ML Engineer Intern',
    location: 'Remote',
    duration: 'Feb 2026 – Present',
    points: [
      'Enhanced real-time user experiences by engineering AI integrations utilizing OpenAI and Google APIs within client websites.',
      'Accelerated development velocity and reduced project ambiguity by architecting comprehensive end-to-end system design documents.',
      'Targeted a 60% reduction in manual content generation by developing an AI-driven education module for adaptive practice tests.'
    ]
  },
  {
    id: 'gdes',
    company: 'GDES Club',
    role: 'Lead Web & Game Developer',
    location: 'IIT Guwahati',
    duration: 'May 2025 – Present',
    points: [
      'Expanded club reach to 4000+ students by leading an 8-person team to build a centralized web platform, implementing state management and routing architectures.',
      'Shipped multiple Unity WebGL game builds, restructuring asset pipelines and developing dynamic exploration modules to showcase student-authored content.',
      'Ensured robust data handling via MongoDB and Postman-tested APIs, while elevating the web UI with infinite carousels, 3D CSS grids, and custom glitch-effect screens.'
    ]
  },
  {
    id: 'shout-otb',
    company: 'Shout-OTB',
    role: 'Motion Graphics Designer',
    location: 'Remote',
    duration: 'Aug – Sep 2025',
    points: [
      'Designed and rendered high-fidelity motion graphics reels for the company website, enhancing brand visual identity.',
      'Conceptualized and created engaging reels using Blender, After Effects and Adobe Premiere Pro.'
    ]
  },
  {
    id: 'strmly',
    company: 'STRMLY',
    role: 'Web Developer Intern',
    location: 'Remote',
    duration: 'June – July 2025',
    points: [
      'Engineered core social features including follow, share, save, and comment voting by integrating new REST API endpoints in the frontend with custom React state hooks.',
      'Elevated user engagement by developing categorized notification tabs and overhauling the UI with robust login checks, interactive SVG icons, and unified data types.',
      'Validated platform stability during the initial rollout phase, successfully delivering a flawless user experience that captured 50+ downloads and 11 five-star app reviews.'
    ]
  }
];

// Atmospheric corruption replacing standard titles at high horror levels
const CORRUPTED_COMPANIES = ['THE_ARCHIVES', 'OBSERVATION_WARD', 'SIMULATION_NODE', 'ECHO_CHAMBER'];
const CORRUPTED_ROLES = ['SUBJECT_04', 'UNWILLING_PARTICIPANT', 'FORGOTTEN_PROCESS', 'WANDERING_GHOST'];
const CORRUPTED_DURATIONS = ['TIME_IS_A_FLAT_CIRCLE', 'ETERNITY', 'SINCE_THE_BEGINNING', 'IT_NEVER_HAPPENED'];

const ExperienceSection = () => {
  const { horrorLevel, escalate } = useHorror();
  const [hoveredId, setHoveredId] = useState(null);

  const getCompany = (exp, i) => horrorLevel >= 6 ? CORRUPTED_COMPANIES[i % CORRUPTED_COMPANIES.length] : exp.company;
  const getRole = (exp, i) => horrorLevel >= 5 ? CORRUPTED_ROLES[i % CORRUPTED_ROLES.length] : exp.role;
  const getDuration = (exp, i) => horrorLevel >= 7 ? CORRUPTED_DURATIONS[i % CORRUPTED_DURATIONS.length] : exp.duration;

  return (
    <section className="section experience-section">
      <div className="section-header">
        <span className="section-tag">{"// ACTIVITY_LOG"}</span>
        <h2 className="section-title">
          {horrorLevel >= 6 ? 'FALSE_MEMORIES' : 'EXPERIENCE'}
        </h2>
        <div className="section-divider" />
      </div>

      {horrorLevel >= 4 && (
        <div className="experience-warning">
          ⚠ ANOMALY DETECTED IN TIMELINE DATA. PROCEED WITH CAUTION.
        </div>
      )}

      <div className="experience-timeline">
        {EXPERIENCES.map((exp, i) => (
          <div 
            key={exp.id} 
            className={`exp-item ${hoveredId === exp.id ? 'hovered' : ''} ${horrorLevel >= 5 && i % 2 === 0 ? 'corrupted-exp' : ''}`}
            onMouseEnter={() => setHoveredId(exp.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => escalate('experience')}
          >
            <div className="exp-timeline-marker">
              <div className="exp-dot" />
              {i !== EXPERIENCES.length - 1 && <div className="exp-line" />}
            </div>

            <div className="exp-content">
              <div className="exp-header">
                <div>
                  <h3 className={`exp-role ${horrorLevel >= 5 ? 'glitch-text-sm' : ''}`}>
                    {getRole(exp, i)}
                  </h3>
                  <div className="exp-company-loc">
                    <span className="exp-company">{getCompany(exp, i)}</span>
                    <span className="exp-separator">{" // "}</span>
                    <span className="exp-location">{horrorLevel >= 6 ? 'UNKNOWN_ORIGIN' : exp.location}</span>
                  </div>
                </div>
                <div className={`exp-duration ${horrorLevel >= 7 ? 'danger-text' : ''}`}>
                  {getDuration(exp, i)}
                </div>
              </div>

              <ul className="exp-points">
                {exp.points.map((point, j) => (
                  <li key={j} className="exp-point-item">
                    <span className="exp-point-bullet">▸</span>
                    <span className={horrorLevel >= 7 && i === 1 && j === 1 ? 'redacted-text' : ''}>
                      {horrorLevel >= 7 && i === 1 && j === 1 ? '▓▒░ MEMORY EXPUNGED ░▒▓' : point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExperienceSection;