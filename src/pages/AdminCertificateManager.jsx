import React, { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import { Award, Search, Trash2, CheckCircle, XCircle } from 'lucide-react';

const AdminCertificateManager = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/admin/certificates', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCertificates(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (id) => {
    if (!window.confirm('Are you sure you want to revoke this certificate?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/certificates/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (res.ok) {
        fetchCertificates();
      }
    } catch (err) {
      console.error('Failed to revoke', err);
    }
  };

  const filteredCerts = certificates.filter(c => 
    c.certificateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2rem' }}>
            <Award size={32} color="var(--accent-primary)" />
            Certificate Manager
          </h1>
          <p className="text-secondary">View and manage all issued certificates.</p>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem', position: 'relative', maxWidth: '400px' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-tertiary)' }} />
        <input 
          type="text" 
          placeholder="Search by ID, student, or course..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
        />
      </div>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
              <th style={{ padding: '1rem', fontWeight: 600 }}>ID</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Student</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Course</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCerts.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No certificates found.</td></tr>
            ) : (
              filteredCerts.map(cert => (
                <tr key={cert.certificateId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{cert.certificateId}</td>
                  <td style={{ padding: '1rem' }}>{cert.studentName}<br/><small className="text-tertiary">{cert.userEmail}</small></td>
                  <td style={{ padding: '1rem' }}>{cert.courseName}</td>
                  <td style={{ padding: '1rem' }}>{new Date(cert.issueDate).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>
                    {cert.status === 'active' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--success-color)', fontSize: '0.875rem', background: 'rgba(34, 197, 94, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                        <CheckCircle size={14} /> Active
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--error-color)', fontSize: '0.875rem', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 8px', borderRadius: '4px' }}>
                        <XCircle size={14} /> Revoked
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {cert.status === 'active' && (
                      <button className="icon-btn" onClick={() => handleRevoke(cert.certificateId)} title="Revoke Certificate">
                        <Trash2 size={18} color="var(--error-color)" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCertificateManager;
