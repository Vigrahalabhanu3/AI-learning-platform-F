import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Target, TrendingUp, Award, Brain, Code, FileText, Briefcase, ChevronRight } from 'lucide-react';
import './PlacementDashboard.css';

// Sub-pages placeholder
import TopicPracticePage from './TopicPracticePage';
import MockTestSection from './MockTestSection';
import CompanyPreparation from './CompanyPreparation';
import InterviewPreparation from './InterviewPreparation';

export default function PlacementDashboard() {
  const [progress, setProgress] = useState({
    totalQuestionsSolved: 0,
    accuracy: 0,
    streak: 0,
    weakAreas: [],
    strongAreas: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch progress stats
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('token') || 'dummy-token'; // Fallback for simple auth
        const res = await fetch(import.meta.env.VITE_API_URL + '/api/placement/progress', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setProgress(data);
        }
      } catch (err) {
        console.error("Failed to fetch placement progress", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  return (
    <div className="placement-hub">
      <Routes>
        <Route index element={
          <div className="hub-dashboard fade-in">
            <div className="hub-header">
              <h1>Placement Preparation Hub</h1>
              <p>Your one-stop destination for internships, campus placements, and technical interviews.</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card glass">
                <Target className="stat-icon text-blue" />
                <div className="stat-info">
                  <h3>{progress.totalQuestionsSolved}</h3>
                  <p>Questions Solved</p>
                </div>
              </div>
              <div className="stat-card glass">
                <TrendingUp className="stat-icon text-green" />
                <div className="stat-info">
                  <h3>{progress.accuracy.toFixed(1)}%</h3>
                  <p>Overall Accuracy</p>
                </div>
              </div>
              <div className="stat-card glass">
                <Award className="stat-icon text-orange" />
                <div className="stat-info">
                  <h3>{progress.streak}</h3>
                  <p>Day Streak</p>
                </div>
              </div>
            </div>

            <h2 className="section-title">Preparation Modules</h2>
            <div className="modules-grid">
              <Link to="aptitude" className="module-card glass">
                <Brain className="module-icon" />
                <h3>Aptitude & Reasoning</h3>
                <p>Quant, Logical, and Verbal Ability</p>
                <span className="go-link">Practice <ChevronRight size={16}/></span>
              </Link>
              <Link to="dsa" className="module-card glass">
                <Code className="module-icon" />
                <h3>Data Structures & Algorithms</h3>
                <p>Arrays, Trees, Graphs, DP</p>
                <span className="go-link">Practice <ChevronRight size={16}/></span>
              </Link>
              <Link to="core" className="module-card glass">
                <FileText className="module-icon" />
                <h3>Core Subjects</h3>
                <p>OS, DBMS, Computer Networks</p>
                <span className="go-link">Practice <ChevronRight size={16}/></span>
              </Link>
              <Link to="companies" className="module-card glass">
                <Briefcase className="module-icon" />
                <h3>Company-Wise</h3>
                <p>TCS, Amazon, Google, Microsoft</p>
                <span className="go-link">Explore <ChevronRight size={16}/></span>
              </Link>
              <Link to="mock-tests" className="module-card glass mock-card">
                <Target className="module-icon" />
                <h3>Mock Tests</h3>
                <p>Full-length timed assessments</p>
                <span className="go-link">Take Test <ChevronRight size={16}/></span>
              </Link>
              <Link to="interviews" className="module-card glass interview-card">
                <Award className="module-icon" />
                <h3>Interview Prep</h3>
                <p>HR, Technical, System Design</p>
                <span className="go-link">Prepare <ChevronRight size={16}/></span>
              </Link>
            </div>
            
            <div className="seed-action" style={{marginTop: '2rem', textAlign: 'center'}}>
               <button className="btn-secondary" onClick={async () => {
                 try {
                   await fetch(import.meta.env.VITE_API_URL + '/api/placement/seed', { method: 'POST' });
                   alert("Database Seeded! Refresh the page.");
                 } catch(e) {
                   alert("Seed failed");
                 }
               }}>
                 Seed Mock Data
               </button>
            </div>
          </div>
        } />
        
        {/* Sub Routes */}
        <Route path="aptitude" element={<TopicPracticePage category="Aptitude" />} />
        <Route path="dsa" element={<TopicPracticePage category="DSA" />} />
        <Route path="core" element={<TopicPracticePage category="Core Subjects" />} />
        
        <Route path="mock-tests/*" element={<MockTestSection />} />
        <Route path="companies/*" element={<CompanyPreparation />} />
        <Route path="interviews/*" element={<InterviewPreparation />} />
      </Routes>
    </div>
  );
}
