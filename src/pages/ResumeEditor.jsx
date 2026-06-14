import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Save, Sparkles, Plus, Trash2, ArrowLeft } from 'lucide-react';
import ResumePreview from '../components/ResumePreview';
import Loader from '../components/Loader';
import './ResumeBuilder.css';

const ResumeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/resumes/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (res.ok) {
        setResume(await res.json());
      } else {
        navigate('/resumes');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (showStatus = true) => {
    if (showStatus) setSaving(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/resumes/${id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resume)
      });
    } catch (err) {
      console.error(err);
    } finally {
      if (showStatus) setSaving(false);
    }
  };

  const updateField = (section, field, value) => {
    setResume(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateArrayItem = (section, index, field, value) => {
    setResume(prev => {
      const newArray = [...prev[section]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [section]: newArray };
    });
  };

  const addArrayItem = (section, templateObj) => {
    setResume(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), templateObj]
    }));
  };

  const removeArrayItem = (section, index) => {
    setResume(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  // AI Enhance feature
  const enhanceWithAI = async (action, content, section, index = null, field = null) => {
    try {
      // Show loading in field (optional visual cue, simplified here)
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/resume/enhance`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, content, context: resume.skills || [] })
      });
      if (res.ok) {
        const data = await res.json();
        if (index !== null && field !== null) {
          updateArrayItem(section, index, field, data.result);
        } else {
          updateField(section, field || 'summary', data.result);
        }
      }
    } catch (err) {
      console.error('AI error', err);
    }
  };

  const downloadPDF = async () => {
    setDownloading(true);
    await handleSave(false); // save before download
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/resumes/${id}/download`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resume.title || 'Resume'}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader /></div>;
  if (!resume) return <div>Not found</div>;

  const info = resume.personalInfo || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-primary)' }}>
      {/* Top Navbar */}
      <div style={{ padding: '1rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="icon-btn" onClick={() => navigate('/resumes')}><ArrowLeft size={20} /></button>
          <input 
            type="text" 
            value={resume.title} 
            onChange={(e) => setResume(p => ({ ...p, title: e.target.value }))}
            style={{ fontSize: '1.25rem', fontWeight: 600, border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none' }}
          />
          <select 
            value={resume.template || 'modern'} 
            onChange={(e) => setResume(p => ({ ...p, template: e.target.value }))}
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', marginLeft: '1rem', fontWeight: 600, cursor: 'pointer' }}
          >
            <option value="modern">Modern Template</option>
            <option value="ats">ATS Friendly Template</option>
            <option value="minimal">Minimal Template</option>
            <option value="professional">Professional Template</option>
            <option value="creative">Creative Template</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {saving && <span className="text-secondary" style={{ fontSize: '0.875rem' }}>Saving...</span>}
          <button className="btn-secondary" onClick={() => handleSave()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Save size={16} /> Save
          </button>
          <button className="btn-primary" onClick={downloadPDF} disabled={downloading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {downloading ? <Loader size={16} color="white" /> : <Download size={16} />} 
            Download PDF
          </button>
        </div>
      </div>

      <div className="resume-editor-container">
        {/* Left Sidebar (Form) */}
        <div className="resume-form-sidebar">
          
          <div className="editor-section">
            <div className="editor-section-header"><h3>Personal Information</h3></div>
            <div className="editor-form-grid">
              <div>
                <label>Full Name</label>
                <input type="text" value={info.fullName || ''} onChange={e => updateField('personalInfo', 'fullName', e.target.value)} />
              </div>
              <div>
                <label>Email</label>
                <input type="email" value={info.email || ''} onChange={e => updateField('personalInfo', 'email', e.target.value)} />
              </div>
              <div>
                <label>Phone Number</label>
                <input type="text" value={info.phone || ''} onChange={e => updateField('personalInfo', 'phone', e.target.value)} />
              </div>
              <div>
                <label>Location</label>
                <input type="text" value={info.location || ''} onChange={e => updateField('personalInfo', 'location', e.target.value)} />
              </div>
              <div>
                <label>LinkedIn URL</label>
                <input type="text" value={info.linkedinUrl || ''} onChange={e => updateField('personalInfo', 'linkedinUrl', e.target.value)} />
              </div>
              <div>
                <label>GitHub URL</label>
                <input type="text" value={info.githubUrl || ''} onChange={e => updateField('personalInfo', 'githubUrl', e.target.value)} />
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ margin: 0 }}>Professional Summary</label>
                <button className="ai-btn" onClick={() => enhanceWithAI('summary', info.summary, 'personalInfo', null, 'summary')}>
                  <Sparkles size={12} /> Generate AI Summary
                </button>
              </div>
              <textarea 
                rows={4} 
                value={info.summary || ''} 
                onChange={e => updateField('personalInfo', 'summary', e.target.value)}
                placeholder="Briefly describe your professional background and goals..."
              />
            </div>
          </div>

          <div className="editor-section">
            <div className="editor-section-header">
              <h3>Experience</h3>
              <button className="icon-btn" onClick={() => addArrayItem('experience', { company: '', position: '', startDate: '', endDate: '', description: '' })}><Plus size={20} /></button>
            </div>
            {(resume.experience || []).map((exp, i) => (
              <div key={i} className="editor-item-card">
                <button className="icon-btn" style={{ position: 'absolute', top: '10px', right: '10px' }} onClick={() => removeArrayItem('experience', i)}><Trash2 size={16} color="var(--error-color)"/></button>
                <div className="editor-form-grid">
                  <div>
                    <label>Company</label>
                    <input type="text" value={exp.company} onChange={e => updateArrayItem('experience', i, 'company', e.target.value)} />
                  </div>
                  <div>
                    <label>Position</label>
                    <input type="text" value={exp.position} onChange={e => updateArrayItem('experience', i, 'position', e.target.value)} />
                  </div>
                  <div>
                    <label>Start Date</label>
                    <input type="text" placeholder="e.g. Jan 2020" value={exp.startDate} onChange={e => updateArrayItem('experience', i, 'startDate', e.target.value)} />
                  </div>
                  <div>
                    <label>End Date</label>
                    <input type="text" placeholder="e.g. Present" value={exp.endDate} onChange={e => updateArrayItem('experience', i, 'endDate', e.target.value)} />
                  </div>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label style={{ margin: 0 }}>Description</label>
                    <button className="ai-btn" onClick={() => enhanceWithAI('bullet', exp.description, 'experience', i, 'description')}>
                      <Sparkles size={12} /> Enhance Bullet
                    </button>
                  </div>
                  <textarea rows={3} value={exp.description} onChange={e => updateArrayItem('experience', i, 'description', e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          <div className="editor-section">
            <div className="editor-section-header">
              <h3>Education</h3>
              <button className="icon-btn" onClick={() => addArrayItem('education', { institution: '', degree: '', startYear: '', endYear: '', cgpa: '' })}><Plus size={20} /></button>
            </div>
            {(resume.education || []).map((edu, i) => (
              <div key={i} className="editor-item-card">
                <button className="icon-btn" style={{ position: 'absolute', top: '10px', right: '10px' }} onClick={() => removeArrayItem('education', i)}><Trash2 size={16} color="var(--error-color)"/></button>
                <div className="editor-form-grid">
                  <div>
                    <label>Institution</label>
                    <input type="text" value={edu.institution} onChange={e => updateArrayItem('education', i, 'institution', e.target.value)} />
                  </div>
                  <div>
                    <label>Degree</label>
                    <input type="text" value={edu.degree} onChange={e => updateArrayItem('education', i, 'degree', e.target.value)} />
                  </div>
                  <div>
                    <label>Start Year</label>
                    <input type="text" value={edu.startYear} onChange={e => updateArrayItem('education', i, 'startYear', e.target.value)} />
                  </div>
                  <div>
                    <label>End Year</label>
                    <input type="text" value={edu.endYear} onChange={e => updateArrayItem('education', i, 'endYear', e.target.value)} />
                  </div>
                  <div>
                    <label>CGPA</label>
                    <input type="text" value={edu.cgpa} onChange={e => updateArrayItem('education', i, 'cgpa', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="editor-section">
            <div className="editor-section-header">
              <h3>Skills</h3>
            </div>
            <textarea 
              rows={3} 
              placeholder="React, Node.js, Python (comma separated)"
              value={(resume.skills || []).join(', ')}
              onChange={e => setResume(p => ({ ...p, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) }))}
            />
          </div>

          <div style={{ height: '40px' }}></div> {/* spacer */}

        </div>

        {/* Right Sidebar (Preview) */}
        <div className="resume-preview-sidebar">
          <ResumePreview resume={resume} />
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
