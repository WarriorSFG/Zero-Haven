import React, { useState } from 'react';
import { useHorror } from '../../context/HorrorContext';
import './Section.css';

const PROJECTS = [
  {
    id: 1,
    title: '[INSERT PROJECT TITLE HERE]',
    description: '[INSERT PROJECT DESCRIPTION HERE. What did you build? What problem does it solve? 2 sentences.]',
    tags: ['[TECH]', '[TECH]', '[TECH]'],
    link: '#',
    status: 'DEPLOYED',
  },
  {
    id: 2,
    title: '[INSERT PROJECT TITLE HERE]',
    description: '[INSERT PROJECT DESCRIPTION HERE. What did you build? What problem does it solve? 2 sentences.]',
    tags: ['[TECH]', '[TECH]', '[TECH]'],
    link: '#',
    status: 'DEPLOYED',
  },
  {
    id: 3,
    title: '[INSERT PROJECT TITLE HERE]',
    description: '[INSERT PROJECT DESCRIPTION HERE. What did you build? What problem does it solve? 2 sentences.]',
    tags: ['[TECH]', '[TECH]'],
    link: '#',
    status: 'IN_PROGRESS',
  },
  {
    id: 4,
    title: '[INSERT PROJECT TITLE HERE]',
    description: '[INSERT PROJECT DESCRIPTION HERE. What did you build? What problem does it solve? 2 sentences.]',
    tags: ['[TECH]', '[TECH]', '[TECH]'],
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
            onMouseEnter={() => { setHoveredId(project.id); escalate('hover'); }}
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
