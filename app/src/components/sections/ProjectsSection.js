import React, { useState } from 'react';
import { useHorror } from '../../context/HorrorContext';
import './Section.css';

const PROJECTS = [
  {
    id: 1,
    title: 'ORION SECURITY MIDDLEWARE',
    description: 'Architected an 8-stage security middleware that screens LLM prompts for jailbreaks and copyrighted code. It streams NDJSON updates to a React UI while performing real-time PII anonymization and harm analysis.',
    tags: ['React', 'Node.js', 'Azure'],
    link: 'https://github.com/WarriorSFG/Goldilocks',
    status: 'DEPLOYED',
  },
  {
    id: 2,
    title: 'SECRETLY ON-CHAIN MESSENGER',
    description: 'Developed a gas-optimized messaging protocol on Arbitrum L2 that utilizes Solidity events to slash transaction costs by 99.3%. It implements meta-transactions via BN254 BLS cryptography to completely eliminate sender fees.',
    tags: ['Solidity', 'Ethereum', 'Web3'],
    link: 'https://github.com/Web3Assam/jubilant-waffle',
    status: 'DEPLOYED',
  },
  {
    id: 3,
    title: 'CHAT CATALYST',
    description: 'Engineered a Chrome Extension for WhatsApp Web that integrates Gemini 2.5 Flash for real-time AI autocomplete and tone-aware rewrites. It secures user API keys using AES-GCM encryption within a background service worker.',
    tags: ['JavaScript', 'Gemini API', 'React'],
    link: 'https://github.com/WarriorSFG/Chat-Catalyst',
    status: 'IN_PROGRESS',
  },
  {
    id: 4,
    title: 'THE PRODIGAL SUN',
    description: 'Shipped a fast-paced 3D rogue-like survival game that secured 1st Position at the Kriti Game Jam 2026. Built within the Unity Engine, the game features custom-scripted C# mechanics and dynamic asset pipelines.',
    tags: ['C#', 'Unity3D', 'Game Dev'],
    link: '#',
    status: 'ARCHIVED',
  },
];

// Corrupted project titles shown at high horror levels
const CORRUPTED_TITLES = [
  'IT_WATCHES_YOU_BUILD',
  'YOUR_CODE_BLEEDS',
  'NULL_NULL_NULL',
  '▓▓▓▓▓▓▓▓▓▓▓▓',
];

const ProjectsSection = () => {
  const { horrorLevel, escalate } = useHorror();
  const [hoveredId, setHoveredId] = useState(null);

  const getTitle = (project, i) => {
    if (horrorLevel >= 7) return CORRUPTED_TITLES[i % CORRUPTED_TITLES.length];
    if (horrorLevel >= 5 && i === 0) return CORRUPTED_TITLES[0];
    return project.title;
  };

  const getStatus = (status) => {
    if (horrorLevel >= 6) return 'CORRUPTED';
    return status;
  };

  return (
    <section className="section projects-section">
      <div className="section-header">
        <span className="section-tag">// ARCHIVES</span>
        <h2 className="section-title">
          {horrorLevel >= 6 ? 'EVIDENCE' : 'PROJECTS'}
        </h2>
        <div className="section-divider" />
      </div>

      <div className="projects-grid">
        {PROJECTS.map((project, i) => (
          <div
            key={project.id}
            className={`project-card ${hoveredId === project.id ? 'hovered' : ''} ${horrorLevel >= 5 && i === 0 ? 'corrupted-card' : ''}`}
            onMouseEnter={() => { setHoveredId(project.id); }}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => escalate('project')}
          >
            <div className="project-card-inner">
              {/* Top row */}
              <div className="project-top-row">
                <span className={`project-status status-${getStatus(project.status).toLowerCase()}`}>
                  ● {getStatus(project.status)}
                </span>
                <span className="project-id">
                  #{project.id.toString().padStart(3, '0')}
                </span>
              </div>

              {/* Title */}
              <h3 className={`project-title ${horrorLevel >= 5 && i === 0 ? 'glitch-text-sm' : ''}`}
                data-text={getTitle(project, i)}>
                {getTitle(project, i)}
              </h3>

              {/* Description */}
              <p className="project-desc">
                {horrorLevel >= 7 && i < 2
                  ? '▓▒░ DATA EXPUNGED ░▒▓'
                  : project.description}
              </p>

              {/* Tags */}
              <div className="project-tags">
                {project.tags.map((tag, j) => (
                  <span key={j} className="project-tag">{tag}</span>
                ))}
              </div>

              {/* Link */}
              <a
                href={project.link}
                className="project-link"
                onClick={(e) => { e.preventDefault(); escalate('link'); }}
              >
                {horrorLevel >= 5 ? 'ACCESS_DENIED //' : 'VIEW_PROJECT //'} →
              </a>
            </div>

            {/* Hover scan line */}
            {hoveredId === project.id && <div className="card-scan-line" />}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
