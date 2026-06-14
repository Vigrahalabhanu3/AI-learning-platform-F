import React, { useState, useEffect } from 'react';
import { ChevronLeft, Building } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CompanyPreparation() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/api/placement/companies')
      .then(res => res.json())
      .then(setCompanies)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in">
      <Link to="/placement" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '1rem', textDecoration: 'none' }}>
        <ChevronLeft size={20} /> Back to Hub
      </Link>
      <h1 style={{ marginBottom: '0.5rem' }}>Company-Wise Preparation</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Prepare for specific companies based on their hiring patterns.</p>

      {loading ? (
        <p>Loading companies...</p>
      ) : companies.length === 0 ? (
        <div className="glass p-4 text-center">
          <p>No companies available currently.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {companies.map(company => (
            <div key={company.id} className="glass p-4" style={{ borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '8px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building size={20} color="var(--accent-primary)" />
                </div>
                <h3 style={{ margin: 0 }}>{company.name}</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>{company.about}</p>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                <strong>Hiring Pattern:</strong><br/>
                <span style={{ color: 'var(--text-tertiary)' }}>{company.hiringPattern}</span>
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: '4px', background: company.difficultyLevel === 'Hard' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)', color: company.difficultyLevel === 'Hard' ? '#ef4444' : '#3b82f6' }}>
                  {company.difficultyLevel}
                </span>
                <button className="btn-secondary" onClick={() => alert("Company questions coming soon!")}>View Questions</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
