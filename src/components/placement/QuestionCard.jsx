import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function QuestionCard({ question }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState(null); // { isCorrect, correctAnswer, explanation }
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedOption) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token') || 'dummy-token';
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/placement/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers: { [question.id]: selectedOption } })
      });
      const data = await res.json();
      if (data.results && data.results[question.id]) {
        setResult(data.results[question.id]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.8rem', padding: '2px 8px', borderRadius: '4px', background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{question.difficulty}</span>
        {question.companyTags && question.companyTags.length > 0 && (
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>{question.companyTags.join(', ')}</span>
        )}
      </div>
      <p style={{ marginBottom: '1rem' }}>{question.questionText}</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
        {question.options && question.options.map((opt, idx) => {
          let bg = 'rgba(255,255,255,0.05)';
          let border = '1px solid transparent';
          
          if (result) {
            if (opt === result.correctAnswer) {
              bg = 'rgba(16, 185, 129, 0.2)';
              border = '1px solid #10b981';
            } else if (opt === selectedOption && !result.isCorrect) {
              bg = 'rgba(239, 68, 68, 0.2)';
              border = '1px solid #ef4444';
            }
          } else if (opt === selectedOption) {
            bg = 'rgba(59, 130, 246, 0.2)';
            border = '1px solid #3b82f6';
          }

          return (
            <button 
              key={idx}
              onClick={() => !result && setSelectedOption(opt)}
              disabled={!!result}
              style={{
                textAlign: 'left',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                background: bg,
                border: border,
                color: 'var(--text-primary)',
                cursor: result ? 'default' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {!result ? (
        <button className="btn-primary" onClick={handleSubmit} disabled={!selectedOption || submitting}>
          {submitting ? 'Checking...' : 'Check Answer'}
        </button>
      ) : (
        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: `4px solid ${result.isCorrect ? '#10b981' : '#ef4444'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: result.isCorrect ? '#10b981' : '#ef4444' }}>
            {result.isCorrect ? <CheckCircle size={18}/> : <XCircle size={18}/>}
            <strong>{result.isCorrect ? 'Correct!' : 'Incorrect'}</strong>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <strong>Explanation:</strong> {result.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
