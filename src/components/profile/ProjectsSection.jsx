import React from 'react';
import { FolderGit2, ExternalLink, Code2 } from 'lucide-react';

export default function ProjectsSection({ projects = [] }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="profile-card">
        <h3 className="profile-card-title"><FolderGit2 size={20} /> Projects</h3>
        <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
          No projects added yet. Connect your GitHub or add manually.
        </p>
      </div>
    );
  }

  return (
    <div className="profile-card">
      <h3 className="profile-card-title"><FolderGit2 size={20} /> Projects</h3>
      <div className="repo-grid">
        {projects.map((proj, idx) => (
          <div key={idx} className="repo-card">
            <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', justifyContent: 'space-between' }}>
              <span>{proj.name}</span>
              {proj.demoUrl && (
                <a href={proj.demoUrl} target="_blank" rel="noreferrer" style={{ color: '#9CA3AF' }} title="Live Demo">
                  <ExternalLink size={16} />
                </a>
              )}
            </h4>
            <p className="repo-desc">{proj.description}</p>
            <div className="repo-meta" style={{ marginTop: 'auto' }}>
              {proj.technologies?.map(tech => (
                <span key={tech} className="badge-item" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', border: 'none', backgroundColor: '#374151' }}>
                  {tech}
                </span>
              ))}
              {proj.githubUrl && (
                <a href={proj.githubUrl} target="_blank" rel="noreferrer" style={{ marginLeft: 'auto', color: '#9CA3AF' }} title="Source Code">
                  <Code2 size={16} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
