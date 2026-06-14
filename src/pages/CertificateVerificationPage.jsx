import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Award } from 'lucide-react';
import Loader from '../components/Loader';

const CertificateVerificationPage = () => {
  const { id } = useParams();
  const [status, setStatus] = useState('loading'); // loading, valid, invalid
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    const verifyCert = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/verify/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.valid) {
            setCertificate(data.certificate);
            setStatus('valid');
          } else {
            setStatus('invalid');
          }
        } else {
          setStatus('invalid');
        }
      } catch (err) {
        setStatus('invalid');
      }
    };
    verifyCert();
  }, [id]);

  if (status === 'loading') return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader /></div>;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: '500px', width: '100%', background: 'var(--bg-secondary)', borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center', border: '1px solid var(--border-color)', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        
        {status === 'valid' ? (
          <>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success-color)', marginBottom: '1.5rem' }}>
              <CheckCircle size={40} />
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Certificate Verified</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>This certificate is authentic and valid.</p>
            
            <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '12px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <small style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Certificate ID</small>
                <div style={{ fontSize: '1.125rem', fontFamily: 'monospace', fontWeight: 600 }}>{certificate.certificateId}</div>
              </div>
              <div>
                <small style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Issued To</small>
                <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>{certificate.studentName}</div>
              </div>
              <div>
                <small style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Course</small>
                <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--accent-primary)' }}>{certificate.courseName}</div>
              </div>
              <div>
                <small style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Issue Date</small>
                <div style={{ fontSize: '1.125rem' }}>{new Date(certificate.issueDate).toLocaleDateString()}</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', marginBottom: '1.5rem' }}>
              <XCircle size={40} />
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Invalid Certificate</h1>
            <p style={{ color: 'var(--text-secondary)' }}>We could not verify a certificate with ID: <strong>{id}</strong>.</p>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>It may have been revoked or does not exist.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default CertificateVerificationPage;
