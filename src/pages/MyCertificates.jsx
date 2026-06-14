import React, { useState, useEffect } from 'react';
import CertificateCard from '../components/CertificateCard';
import Loader from '../components/Loader';
import { Award } from 'lucide-react';

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/certificates', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (!res.ok) throw new Error('Failed to fetch certificates');
      const data = await res.json();
      setCertificates(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page-content">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2rem' }}>
          <Award size={32} color="var(--accent-primary)" />
          My Certificates
        </h1>
        <p className="text-secondary">View and download your earned certificates.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {certificates.length === 0 && !error ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
          <Award size={48} color="var(--text-tertiary)" style={{ marginBottom: '1rem' }} />
          <h3>No Certificates Yet</h3>
          <p className="text-secondary">Complete roadmaps to earn your first certificate!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {certificates.map(cert => (
            <CertificateCard key={cert.certificateId} certificate={cert} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCertificates;
