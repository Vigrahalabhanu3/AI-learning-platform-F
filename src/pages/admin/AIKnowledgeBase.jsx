import React, { useState, useEffect } from 'react';
import { FileText, Upload, Trash2, Database, AlertCircle } from 'lucide-react';
import './AIKnowledgeBase.css';

export default function AIKnowledgeBase() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const fetchDocs = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/ai/documents');
      const data = await res.json();
      if (res.ok) {
        setDocuments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setError('');
    
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/ai/documents/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Upload failed');
      } else {
        alert(`Success! Processed ${data.chunksProcessed} chunks into Vector DB.`);
        fetchDocs();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = null; // reset
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document from the AI Knowledge Base?")) return;
    
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/ai/documents/${id}`, { method: 'DELETE' });
      fetchDocs();
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  return (
    <div className="knowledge-base-container fade-in">
      <div className="kb-header">
        <h1><Database style={{ marginRight: '10px' }}/> AI Knowledge Base</h1>
        <p>Manage documents that the AI Tutor uses for Retrieval-Augmented Generation (RAG).</p>
      </div>

      <div className="upload-section">
        <Database size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem' }} />
        <h3 style={{ marginBottom: '0.5rem' }}>Upload Course Materials</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Upload PDFs, Markdown files, or TXT notes. The system will automatically chunk the text and generate vector embeddings.</p>
        
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><AlertCircle size={16}/> {error}</div>}
        
        <label className="upload-label">
          {uploading ? 'Processing...' : <><Upload size={18} /> Select File</>}
          <input type="file" accept=".pdf,.md,.txt" onChange={handleFileUpload} disabled={uploading} />
        </label>
      </div>

      <h2 style={{ marginBottom: '1.5rem' }}>Indexed Documents</h2>
      {loading ? (
        <p>Loading documents...</p>
      ) : documents.length === 0 ? (
        <p className="text-secondary">No documents have been indexed yet.</p>
      ) : (
        <div className="doc-list">
          {documents.map(doc => (
            <div key={doc.id} className="doc-item">
              <div className="doc-info">
                <div className="doc-icon">
                  <FileText size={20} />
                </div>
                <div className="doc-details">
                  <h4>{doc.title}</h4>
                  <p>{doc.sourceType} • Indexed on {new Date(doc.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <button className="btn-danger" onClick={() => handleDelete(doc.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
