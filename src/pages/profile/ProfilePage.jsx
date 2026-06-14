import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Edit2, Save, FileText, Award } from 'lucide-react';
import './ProfilePage.css';

import GitHubCard from '../../components/profile/GitHubCard';
import LinkedInCard from '../../components/profile/LinkedInCard';
import StatisticsSection from '../../components/profile/StatisticsSection';
import BadgeSection from '../../components/profile/BadgeSection';
import ProjectsSection from '../../components/profile/ProjectsSection';
import Loader from '../../components/Loader';

export default function ProfilePage() {
  const { user, userProfile, token, fetchUserProfile } = useContext(AuthContext);
  const [editingAbout, setEditingAbout] = useState(false);
  const [aboutText, setAboutText] = useState('');
  const [githubData, setGithubData] = useState(null);

  useEffect(() => {
    if (userProfile?.about) {
      setAboutText(userProfile.about);
    }
  }, [userProfile]);

  useEffect(() => {
    const fetchGH = async () => {
      if (userProfile?.githubUsername) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/github/${userProfile.githubUsername}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setGithubData(data);
          }
        } catch (err) {
          console.error("Failed to fetch github stats", err);
        }
      }
    };
    fetchGH();
  }, [userProfile?.githubUsername, token]);

  const handleSaveAbout = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/profile/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ about: aboutText })
      });
      if (res.ok) {
        await fetchUserProfile(token);
        setEditingAbout(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConnectGitHub = async (username) => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/profile/github/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username })
      });
      if (res.ok) {
        await fetchUserProfile(token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConnectLinkedIn = async (data) => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/profile/linkedin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        await fetchUserProfile(token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!userProfile) {
    return <Loader />;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-header-info">
          <div className="profile-avatar">
            {userProfile?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="profile-name">{userProfile?.name || 'My Profile'}</h1>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/resume" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} /> My Resume
          </Link>
          <Link to="/certificates" className="btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#10B981' }}>
            <Award size={18} /> Certificates
          </Link>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-sidebar">
          {/* About Me Section */}
          <div className="profile-card">
            <h3 className="profile-card-title" style={{ justifyContent: 'space-between' }}>
              About Me
              {!editingAbout ? (
                <button onClick={() => setEditingAbout(true)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
                  <Edit2 size={16} />
                </button>
              ) : (
                <button onClick={handleSaveAbout} style={{ background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer' }}>
                  <Save size={16} />
                </button>
              )}
            </h3>
            {editingAbout ? (
              <textarea 
                value={aboutText} 
                onChange={(e) => setAboutText(e.target.value)}
                style={{ width: '100%', minHeight: '100px', padding: '0.5rem', backgroundColor: '#111827', color: 'white', border: '1px solid #374151', borderRadius: '4px' }}
              />
            ) : (
              <p style={{ color: '#D1D5DB', fontSize: '0.875rem', lineHeight: '1.5' }}>
                {userProfile.about || "No bio added yet. Click edit to tell us about yourself."}
              </p>
            )}
          </div>

          <LinkedInCard profile={userProfile} onConnect={handleConnectLinkedIn} />
          <GitHubCard profile={userProfile} githubData={githubData} onConnect={handleConnectGitHub} />
        </div>

        <div className="profile-main">
          <StatisticsSection stats={userProfile.learningStats} />
          
          <BadgeSection earnedBadges={userProfile.badges} />

          <ProjectsSection projects={userProfile.projects?.length > 0 ? userProfile.projects : githubData?.topRepos?.map(r => ({
            name: r.name,
            description: r.description,
            technologies: [r.language].filter(Boolean),
            githubUrl: r.url
          }))} />
        </div>
      </div>
    </div>
  );
}
