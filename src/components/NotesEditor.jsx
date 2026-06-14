import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Save, Edit2, Eye, Sparkles } from 'lucide-react';
import './NotesEditor.css';

const NotesEditor = ({ initialNotes, onSave, onGenerateAI }) => {
  const [notes, setNotes] = useState(initialNotes || '');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNotes(initialNotes || '');
  }, [initialNotes]);

  const handleSave = () => {
    setIsSaving(true);
    onSave(notes);
    setTimeout(() => setIsSaving(false), 500);
  };

  return (
    <div className="notes-editor card">
      <div className="notes-header">
        <h3 className="notes-title">My Notes</h3>
        <div className="notes-actions">
          <button className="btn-secondary sm" onClick={onGenerateAI}>
            <Sparkles size={14} className="mr-2" style={{color: 'var(--accent-primary)'}} />
            AI Summary
          </button>
          <button className="icon-btn" onClick={() => setIsPreview(!isPreview)} title={isPreview ? "Edit Notes" : "Preview Markdown"}>
            {isPreview ? <Edit2 size={18} /> : <Eye size={18} />}
          </button>
          <button className="icon-btn" onClick={handleSave} title="Save Notes">
            <Save size={18} style={{ color: isSaving ? 'var(--accent-primary)' : 'inherit' }} />
          </button>
        </div>
      </div>
      
      <div className="notes-body">
        {isPreview ? (
          <div className="markdown-preview">
            {notes ? <ReactMarkdown>{notes}</ReactMarkdown> : <p className="empty-state">No notes yet. Switch to edit mode to start typing.</p>}
          </div>
        ) : (
          <textarea
            className="notes-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Start typing your notes here... (Markdown supported)"
          />
        )}
      </div>
    </div>
  );
};

export default NotesEditor;
