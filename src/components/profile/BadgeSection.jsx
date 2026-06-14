import React from 'react';
import { Award } from 'lucide-react';

const DEFAULT_BADGES = [
  { id: 'python-beg', name: 'Python Beginner', icon: '🐍' },
  { id: 'java-exp', name: 'Java Full Stack Explorer', icon: '☕' },
  { id: 'quiz-master', name: 'Quiz Master', icon: '🎯' },
  { id: 'streak-30', name: '30-Day Streak', icon: '🔥' },
  { id: 'top-learner', name: 'Top Learner', icon: '⭐' },
  { id: 'proj-builder', name: 'Project Builder', icon: '🏗️' }
];

export default function BadgeSection({ earnedBadges = [] }) {
  // For demonstration, we'll mark some default badges as earned based on the mock data
  // In a real scenario, this would map directly to userProfile.badges
  
  const earnedSet = new Set(earnedBadges.length > 0 ? earnedBadges : ['python-beg', 'streak-30']);

  return (
    <div className="profile-card">
      <h3 className="profile-card-title"><Award size={20} /> Achievements</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
        {DEFAULT_BADGES.map(badge => {
          const isEarned = earnedSet.has(badge.id);
          return (
            <div 
              key={badge.id} 
              style={{
                backgroundColor: isEarned ? '#1E3A8A' : '#111827',
                border: `1px solid ${isEarned ? '#3B82F6' : '#374151'}`,
                borderRadius: '8px',
                padding: '1rem',
                textAlign: 'center',
                opacity: isEarned ? 1 : 0.5,
                filter: isEarned ? 'none' : 'grayscale(100%)'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{badge.icon}</div>
              <div style={{ fontSize: '0.875rem', color: isEarned ? '#fff' : '#9CA3AF', fontWeight: '500' }}>
                {badge.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
