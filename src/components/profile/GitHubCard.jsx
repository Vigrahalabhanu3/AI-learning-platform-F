import React, { useState } from 'react';
import { Code2, ExternalLink, Star, GitFork, BookOpen } from 'lucide-react';

export default function GitHubCard({ profile, githubData, onConnect }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    await onConnect(username);
    setLoading(false);
  };

  if (!profile?.githubUsername) {
    return (
      <div className="profile-card">
        <h3 className="profile-card-title"><Code2 size={20} /> GitHub Profile</h3>
        <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '1rem' }}>
          Connect your GitHub account to showcase your repositories, top languages, and stats.
        </p>
        <form onSubmit={handleConnect}>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="GitHub Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <button type="submit" className="integration-btn github-btn" disabled={loading}>
            {loading ? 'Connecting...' : 'Connect GitHub'}
          </button>
        </form>
      </div>
    );
  }

  if (!githubData || loading) {
    return (
      <div className="profile-card">
        <h3 className="profile-card-title"><Code2 size={20} /> GitHub Profile</h3>
        <p>Loading GitHub data...</p>
      </div>
    );
  }

  const { profile: ghProfile, topRepos } = githubData;

  return (
    <div className="profile-card">
      <h3 className="profile-card-title">
        <Code2 size={20} /> GitHub
        <a href={profile.githubUrl} target="_blank" rel="noreferrer" style={{ marginLeft: 'auto', color: '#9CA3AF' }}>
          <ExternalLink size={16} />
        </a>
      </h3>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
        <img src={ghProfile.avatar} alt="GitHub Avatar" style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
        <div>
          <h4 style={{ margin: '0 0 0.25rem 0', color: '#fff' }}>{ghProfile.name || ghProfile.username}</h4>
          <p style={{ margin: 0, color: '#9CA3AF', fontSize: '0.875rem' }}>{ghProfile.followers} Followers • {ghProfile.following} Following</p>
        </div>
      </div>

      {ghProfile.bio && (
        <p style={{ fontSize: '0.875rem', color: '#D1D5DB', marginBottom: '1rem' }}>{ghProfile.bio}</p>
      )}

      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-box" style={{ padding: '0.5rem' }}>
          <div className="stat-value" style={{ fontSize: '1.25rem' }}>{ghProfile.publicRepos}</div>
          <div className="stat-label">Repositories</div>
        </div>
        <div className="stat-box" style={{ padding: '0.5rem' }}>
          <div className="stat-value" style={{ fontSize: '1.25rem' }}>{ghProfile.totalStars}</div>
          <div className="stat-label">Total Stars</div>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.875rem', color: '#9CA3AF', margin: '0 0 0.5rem 0' }}>Top Languages</h4>
        <div className="badges-container">
          {ghProfile.topLanguages?.map(lang => (
            <span key={lang} className="badge-item" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>{lang}</span>
          ))}
        </div>
      </div>

      <h4 style={{ fontSize: '0.875rem', color: '#9CA3AF', margin: '0 0 0.5rem 0' }}>Pinned Repositories</h4>
      <div className="repo-grid" style={{ gridTemplateColumns: '1fr' }}>
        {topRepos?.slice(0, 3).map(repo => (
          <div key={repo.id} className="repo-card" style={{ padding: '0.75rem' }}>
            <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem' }}>
              <a href={repo.url} target="_blank" rel="noreferrer"><BookOpen size={14} style={{ display: 'inline', marginRight: '4px' }}/>{repo.name}</a>
            </h4>
            <div className="repo-meta">
              {repo.language && <span className="repo-meta-item"><span style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3B82F6'}}></span>{repo.language}</span>}
              <span className="repo-meta-item"><Star size={12} /> {repo.stars}</span>
              <span className="repo-meta-item"><GitFork size={12} /> {repo.forks}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
