import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import TopicCard from '../../components/placement/TopicCard';

export default function TopicPracticePage({ category }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/api/placement/topics')
      .then(res => res.json())
      .then(data => {
        // Filter by category
        const filtered = data.filter(t => t.category === category);
        setTopics(filtered);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="fade-in">
      <Link to="/placement" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '1rem', textDecoration: 'none' }}>
        <ChevronLeft size={20} /> Back to Hub
      </Link>
      <h1 style={{ marginBottom: '0.5rem' }}>{category} Practice</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Select a topic to start practicing questions.</p>

      {loading ? (
        <p>Loading topics...</p>
      ) : topics.length === 0 ? (
        <div className="glass p-4 text-center">
          <p>No topics found for this category.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {topics.map(topic => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </div>
  );
}
