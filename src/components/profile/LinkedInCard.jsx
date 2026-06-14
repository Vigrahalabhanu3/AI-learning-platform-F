import React, { useState } from 'react';
import { User, ExternalLink, Briefcase, GraduationCap } from 'lucide-react';

export default function LinkedInCard({ profile, onConnect }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    linkedinUrl: '',
    headline: '',
    company: '',
    education: ''
  });

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!formData.linkedinUrl) return;
    setLoading(true);
    await onConnect({
      linkedinUrl: formData.linkedinUrl,
      linkedinData: {
        headline: formData.headline,
        company: formData.company,
        education: formData.education
      }
    });
    setLoading(false);
  };

  if (!profile?.linkedinUrl) {
    return (
      <div className="profile-card">
        <h3 className="profile-card-title"><User size={20} /> LinkedIn Profile</h3>
        <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Connect your LinkedIn to showcase your professional background.
        </p>
        <form onSubmit={handleConnect}>
          <div className="form-group">
            <input 
              type="url" 
              placeholder="LinkedIn URL" 
              required
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
            />
          </div>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Professional Headline" 
              value={formData.headline}
              onChange={(e) => setFormData({...formData, headline: e.target.value})}
            />
          </div>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Current Company / Role" 
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
            />
          </div>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Education (e.g., BSc Computer Science)" 
              value={formData.education}
              onChange={(e) => setFormData({...formData, education: e.target.value})}
            />
          </div>
          <button type="submit" className="integration-btn linkedin-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Connect LinkedIn'}
          </button>
        </form>
      </div>
    );
  }

  const ld = profile.linkedinData || {};

  return (
    <div className="profile-card">
      <h3 className="profile-card-title">
        <User size={20} /> LinkedIn
        <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" style={{ marginLeft: 'auto', color: '#9CA3AF' }}>
          <ExternalLink size={16} />
        </a>
      </h3>

      <div style={{ marginBottom: '1rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>Professional Profile</h4>
        <p style={{ margin: 0, color: '#9CA3AF', fontSize: '0.875rem' }}>{ld.headline || 'No headline provided'}</p>
      </div>

      <div className="linkedin-data-item">
        <strong><Briefcase size={14} style={{ display: 'inline', marginRight: '4px' }}/> Experience</strong>
        <span>{ld.company || 'Not specified'}</span>
      </div>

      <div className="linkedin-data-item">
        <strong><GraduationCap size={14} style={{ display: 'inline', marginRight: '4px' }}/> Education</strong>
        <span>{ld.education || 'Not specified'}</span>
      </div>
    </div>
  );
}
