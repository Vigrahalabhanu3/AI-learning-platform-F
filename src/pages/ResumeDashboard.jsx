import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Copy, Trash2, Edit } from 'lucide-react';
import Loader from '../components/Loader';

const ResumeDashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/resumes', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (res.ok) setResumes(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/resumes', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: 'My New Resume' })
      });
      if (res.ok) {
        const newResume = await res.json();
        navigate(`/resumes/edit/${newResume.id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/resumes/${id}/duplicate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (res.ok) fetchResumes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/resumes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (res.ok) fetchResumes();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2rem' }}>
            <FileText size={32} color="var(--accent-primary)" />
            Resume Builder
          </h1>
          <p className="text-secondary">Create and manage your professional ATS-friendly resumes.</p>
        </div>
        <button className="btn-primary" onClick={handleCreateNew} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Create New Resume
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {resumes.map(resume => (
          <div key={resume.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{resume.title}</h3>
            <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
            </p>
            
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
              <button className="btn-primary" onClick={() => navigate(`/resumes/edit/${resume.id}`)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Edit size={16} /> Edit
              </button>
              <button className="icon-btn" onClick={() => handleDuplicate(resume.id)} title="Duplicate">
                <Copy size={18} />
              </button>
              <button className="icon-btn" onClick={() => handleDelete(resume.id)} title="Delete">
                <Trash2 size={18} color="var(--error-color)" />
              </button>
            </div>
          </div>
        ))}

        {resumes.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
            <FileText size={48} color="var(--text-tertiary)" style={{ marginBottom: '1rem' }} />
            <h3>No Resumes Yet</h3>
            <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>Start building your professional profile today.</p>
            <button className="btn-primary" onClick={handleCreateNew}>Create First Resume</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeDashboard;
