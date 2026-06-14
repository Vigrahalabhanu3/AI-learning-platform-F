import React, { useState, useEffect } from 'react';
import { ChevronLeft, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InterviewPreparation() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState({});

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/api/placement/interview-questions')
      .then(res => res.json())
      .then(setQuestions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleReveal = (id) => {
    setRevealed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = ['HR', 'Technical', 'System Design'];

  return (
    <div className="fade-in">
      <Link to="/placement" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '1rem', textDecoration: 'none' }}>
        <ChevronLeft size={20} /> Back to Hub
      </Link>
      <h1 style={{ marginBottom: '0.5rem' }}>Interview Preparation</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Practice common HR, Technical, and System Design questions.</p>

      {loading ? (
        <p>Loading questions...</p>
      ) : (
        categories.map(category => {
          const categoryQuestions = questions.filter(q => q.category === category);
          if (categoryQuestions.length === 0) return null;

          return (
            <div key={category} style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageCircle size={20} className="text-blue" /> {category} Questions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {categoryQuestions.map(q => (
                  <div key={q.id} className="glass" style={{ padding: '1.5rem', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{q.question}</h3>
                      <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-tertiary)' }}>{q.difficulty}</span>
                    </div>
                    {revealed[q.id] ? (
                      <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '4px solid var(--accent-primary)' }}>
                        <p style={{ margin: 0 }}>{q.answer}</p>
                      </div>
                    ) : (
                      <button className="btn-secondary" onClick={() => toggleReveal(q.id)}>Show Answer</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
