import React from 'react';

const ResumePreview = ({ resume }) => {
  const info = resume.personalInfo || {};
  const education = resume.education || [];
  const experience = resume.experience || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];
  const certifications = resume.certifications || [];
  const achievements = resume.achievements || [];

  return (
    <div className={`resume-document template-${resume.template || 'modern'}`}>
      <div className="resume-header">
        <h1 className="resume-name">{info.fullName || 'Your Name'}</h1>
        <div className="resume-contact">
          {info.email && <span>{info.email}</span>}
          {info.phone && <span>| {info.phone}</span>}
          {info.location && <span>| {info.location}</span>}
          {info.linkedinUrl && <span>| {info.linkedinUrl}</span>}
          {info.githubUrl && <span>| {info.githubUrl}</span>}
        </div>
      </div>

      {info.summary && (
        <div className="resume-section">
          <div className="resume-section-title">Professional Summary</div>
          <div className="resume-desc"><p>{info.summary}</p></div>
        </div>
      )}

      {experience.length > 0 && (
        <div className="resume-section" style={{ marginTop: '1.5rem' }}>
          <div className="resume-section-title">Experience</div>
          {experience.map((exp, i) => (
            <div key={i} className="resume-item">
              <div className="resume-item-header">
                <span>{exp.position}</span>
                <span>{exp.company}</span>
              </div>
              <div className="resume-item-sub">
                <span>{exp.startDate || ''} - {exp.endDate || 'Present'}</span>
              </div>
              <div className="resume-desc">
                {exp.description && <p style={{ whiteSpace: 'pre-wrap' }}>{exp.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div className="resume-section" style={{ marginTop: '1.5rem' }}>
          <div className="resume-section-title">Education</div>
          {education.map((edu, i) => (
            <div key={i} className="resume-item">
              <div className="resume-item-header">
                <span>{edu.degree}</span>
                <span>{edu.institution}</span>
              </div>
              <div className="resume-item-sub">
                <span>{edu.startYear || ''} - {edu.endYear || ''}</span>
                {edu.cgpa && <span>CGPA: {edu.cgpa}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="resume-section" style={{ marginTop: '1.5rem' }}>
          <div className="resume-section-title">Skills</div>
          <ul className="resume-skills">
            {skills.map((s, i) => (
              <li key={i}>{s.name || s}</li>
            ))}
          </ul>
        </div>
      )}

      {projects.length > 0 && (
        <div className="resume-section" style={{ marginTop: '1.5rem' }}>
          <div className="resume-section-title">Projects</div>
          {projects.map((proj, i) => (
            <div key={i} className="resume-item">
              <div className="resume-item-header">
                <span>{proj.name}</span>
              </div>
              <div className="resume-item-sub">
                <span>{proj.technologies || ''}</span>
              </div>
              <div className="resume-desc">
                {proj.description && <p style={{ whiteSpace: 'pre-wrap' }}>{proj.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {certifications.length > 0 && (
        <div className="resume-section" style={{ marginTop: '1.5rem' }}>
          <div className="resume-section-title">Certifications</div>
          {certifications.map((cert, i) => (
            <div key={i} className="resume-item">
              <div className="resume-item-header">
                <span>{cert.name}</span>
                <span>{cert.organization}</span>
              </div>
              <div className="resume-item-sub">
                <span>{cert.date || ''}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {achievements.length > 0 && (
        <div className="resume-section" style={{ marginTop: '1.5rem' }}>
          <div className="resume-section-title">Achievements</div>
          <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0' }}>
            {achievements.map((ach, i) => (
              <li key={i} style={{ marginBottom: '0.25rem' }}>{ach.description || ach}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumePreview;
