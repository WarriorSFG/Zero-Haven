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
    link: 'https://github.com/WarriorSFG/psychic-telegram',
    status: 'ARCHIVED',
    // ── ANOMALY: This project is #4 but will render as #000 ──
    anomalyId: true,
  },
  {
    id: 5,
    title: 'CONVOLVE 4.0 // DOCUMENT AI',
    description: 'Engineered a hybrid vision-language pipeline using YOLO and Qwen3-VL to accurately extract structured fields from multilingual invoice PDFs. The system bypasses no-ground-truth constraints, achieving 99.3% mAP@50 while keeping inference costs under a cent per document.',
    tags: ['Computer Vision', 'OCR', 'YOLO'],
    link: '#',
    status: 'ARCHIVED',
  },
  {
    id: 6,
    title: 'REDRESERVE PLATFORM',
    description: 'Built a centralized blood donation network that connects eligible donors with hospitals through a real-time interactive map and precise pincode-based matching. The system features secure dual portals for tracking live blood inventory, scheduling, and broadcasting urgent requests.',
    // ── ANOMALY: One tag reads "HELP_ME" ──
    tags: ['React.js', 'Node.js', 'HELP_ME', 'MongoDB'],
    link: 'https://github.com/RedReserveWebHandle/Red-Reserve-Frontend',
    status: 'ARCHIVED',
    anomalyTag: true,
  },
  {
    id: 7,
    title: 'CUSTOM COGNITIVE LLM',
    description: 'Fine-tuned a 7B parameter LLM on over one million curated samples to handle varied intents, ranging from context-aware casual conversation to complex mathematical reasoning. The architecture utilizes a custom wrapper that dynamically adjusts prompts and securely executes generated Python code blocks.',
    tags: ['AI/ML', 'LLM', 'Python'],
    link: '#',
    status: 'DEPLOYED',
  }
];

// Corrupted project titles shown at high horror levels
const CORRUPTED_TITLES = [
  'IT_WATCHES_YOU_BUILD',
  'YOUR_CODE_BLEEDS',
  'NULL_NULL_NULL',
  '▓▓▓▓▓▓▓▓▓▓▓▓',
];

const ProjectsSection = () => {
  const { horrorLevel, escalate, discoverAnomaly, foundAnomalies } = useHorror();
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

  // ── ANOMALY 1: Project #4 shows #000 ──
  const getProjectId = (project) => {
    if (project.anomalyId) return '000';  // Wrong ID for project 4
    return project.id.toString().padStart(3, '0');
  };

  return (
    <section className="section projects-section">
      <div className="section-header">
        <span className="section-tag">{"// ARCHIVES"}</span>
        <h2 className="section-title">
          {horrorLevel >= 6 ? 'EVIDENCE' : 'PROJECTS'}
        </h2>
        <div className="section-divider" />
      </div>

      <div className="projects-grid">
        {PROJECTS.map((project, i) => (
          <div
            key={project.id}
            className={`project-card
              ${hoveredId === project.id ? 'hovered' : ''}
              ${horrorLevel >= 5 && i === 0 ? 'corrupted-card' : ''}
            `}
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => escalate('project')}
          >
            <div className="project-card-inner">
              {/* Top row */}
              <div className="project-top-row">
                <span className={`project-status status-${getStatus(project.status).toLowerCase()}`}>
                  ● {getStatus(project.status)}
                </span>
                {/* ── ANOMALY 1: Project #4 shows #000 — clicking the ID badge finds it ── */}
                <span
                  className={`project-id
                    ${project.anomalyId && !foundAnomalies.has('projects_wrong_id') ? 'anomaly-id-pulse' : ''}
                    ${project.anomalyId && foundAnomalies.has('projects_wrong_id') ? 'anomaly-found-text' : ''}
                  `}
                  onClick={project.anomalyId ? (e) => {
                    e.stopPropagation();
                    discoverAnomaly('projects_wrong_id');
                  } : undefined}
                  title={project.anomalyId && !foundAnomalies.has('projects_wrong_id')
                    ? 'Wait... this number doesn\'t look right'
                    : undefined}
                  style={project.anomalyId ? { cursor: 'pointer' } : {}}
                >
                  #{getProjectId(project)}
                </span>
              </div>

              {/* Title */}
              <h3
                className={`project-title ${horrorLevel >= 5 && i === 0 ? 'glitch-text-sm' : ''}`}
                data-text={getTitle(project, i)}
              >
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
                {project.tags.map((tag, j) => {
                  const isAnomalyTag = project.anomalyTag && tag === 'HELP_ME';
                  return (
                    <span
                      key={j}
                      className={`project-tag
                        ${isAnomalyTag ? 'anomaly-tag' : ''}
                        ${isAnomalyTag && foundAnomalies.has('projects_phantom_tag') ? 'anomaly-tag-found' : ''}
                      `}
                      onClick={isAnomalyTag ? (e) => {
                        e.stopPropagation();
                        discoverAnomaly('projects_phantom_tag');
                      } : undefined}
                      title={isAnomalyTag && !foundAnomalies.has('projects_phantom_tag')
                        ? 'This tag... should not be here'
                        : undefined}
                      style={isAnomalyTag ? { cursor: 'pointer' } : {}}
                    >
                      {tag}
                    </span>
                  );
                })}
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
