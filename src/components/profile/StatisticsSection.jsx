import React from 'react';
import { BookOpen, Map, Award, Clock, Star, Trophy } from 'lucide-react';

export default function StatisticsSection({ stats }) {
  if (!stats) return null;

  return (
    <div className="profile-card">
      <h3 className="profile-card-title">Learning Statistics</h3>
      <div className="stats-grid">
        <div className="stat-box">
          <BookOpen size={24} style={{ color: '#3B82F6', margin: '0 auto 0.5rem' }} />
          <div className="stat-value">{stats.coursesCompleted || 0}</div>
          <div className="stat-label">Courses Completed</div>
        </div>
        
        <div className="stat-box">
          <Map size={24} style={{ color: '#10B981', margin: '0 auto 0.5rem' }} />
          <div className="stat-value">{stats.roadmapsCompleted || 0}</div>
          <div className="stat-label">Roadmaps Completed</div>
        </div>

        <div className="stat-box">
          <Award size={24} style={{ color: '#F59E0B', margin: '0 auto 0.5rem' }} />
          <div className="stat-value">{stats.certificatesEarned || 0}</div>
          <div className="stat-label">Certificates Earned</div>
        </div>

        <div className="stat-box">
          <Clock size={24} style={{ color: '#8B5CF6', margin: '0 auto 0.5rem' }} />
          <div className="stat-value">{stats.totalLearningHours || 0}h</div>
          <div className="stat-label">Learning Time</div>
        </div>

        <div className="stat-box">
          <Star size={24} style={{ color: '#EF4444', margin: '0 auto 0.5rem' }} />
          <div className="stat-value">{stats.xpPoints || 0}</div>
          <div className="stat-label">XP Points</div>
        </div>

        <div className="stat-box">
          <Trophy size={24} style={{ color: '#EC4899', margin: '0 auto 0.5rem' }} />
          <div className="stat-value" style={{ fontSize: '1.25rem' }}>{stats.rankLevel || 'Novice'}</div>
          <div className="stat-label">Current Rank</div>
        </div>
      </div>
    </div>
  );
}
