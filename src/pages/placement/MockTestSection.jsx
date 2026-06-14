import React, { useState, useEffect } from 'react';
import { ChevronLeft, Play, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MockTestSection() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/api/placement/mock-tests')
      .then(res => res.json())
      .then(setTests)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in">
      <Link to="/placement" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '1rem', textDecoration: 'none' }}>
        <ChevronLeft size={20} /> Back to Hub
      </Link>
      <h1 style={{ marginBottom: '0.5rem' }}>Mock Tests</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Take full-length timed assessments to evaluate your preparation.</p>

      {loading ? (
        <p>Loading tests...</p>
      ) : tests.length === 0 ? (
        <div className="glass p-4 text-center">
          <p>No mock tests available currently.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {tests.map(test => (
            <div key={test.id} className="glass p-4" style={{ borderRadius: '12px' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>{test.title}</h3>
              <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Clock size={16} /> {test.durationMinutes} Minutes {test.negativeMarking ? '• Negative Marking' : ''}
              </p>
              <button className="btn-primary w-100 flex-center" onClick={() => alert("Test UI is under construction")}>
                <Play size={16} style={{ marginRight: '0.5rem' }}/> Start Test
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
