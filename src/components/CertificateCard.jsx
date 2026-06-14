import React from 'react';
import { Download, CheckCircle, Award } from 'lucide-react';

const CertificateCard = ({ certificate, onPreview }) => {
  const downloadPdf = () => {
    window.open(`${import.meta.env.VITE_API_URL}/api/certificates/${certificate.certificateId}/pdf`, '_blank');
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1, color: 'var(--accent-primary)' }}>
        <Award size={120} />
      </div>
      
      <div style={{ zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <CheckCircle size={20} color="var(--success-color)" />
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 600 }}>COMPLETED</span>
        </div>
        
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{certificate.courseName}</h3>
        
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
          Issued: {new Date(certificate.issueDate).toLocaleDateString()}
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          ID: {certificate.certificateId}
        </p>
        
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
          <button className="btn-primary" onClick={downloadPdf} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }}>
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;
