import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import QuestionCard from './QuestionCard';

export default function TopicCard({ topic }) {
  const [expanded, setExpanded] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleExpand = () => {
    if (!expanded && questions.length === 0) {
      setLoading(true);
      fetch(`${import.meta.env.VITE_API_URL}/api/placement/questions?topicId=${topic.id}`)
        .then(res => res.json())
        .then(setQuestions)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
    setExpanded(!expanded);
  };

  return (
    <div className="topic-card glass" style={{ borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BookOpen size={20} color="#3b82f6" />
        </div>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{topic.name}</h3>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', flexGrow: 1 }}>{topic.description}</p>
      
      <button className="btn-secondary w-100 flex-center" onClick={handleExpand} style={{ gap: '0.5rem' }}>
        {expanded ? 'Hide Questions' : 'Practice Questions'}
        {expanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
      </button>

      {expanded && (
        <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {loading ? (
            <p className="text-center text-secondary">Loading...</p>
          ) : questions.length === 0 ? (
            <p className="text-center text-secondary">No questions available.</p>
          ) : (
            questions.map(q => <QuestionCard key={q.id} question={q} />)
          )}
        </div>
      )}
    </div>
  );
}
