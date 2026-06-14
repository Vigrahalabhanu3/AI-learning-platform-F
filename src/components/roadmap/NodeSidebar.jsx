import { X } from 'lucide-react';
import ReactPlayer from 'react-player';

const NodeSidebar = ({ node, onClose, onUpdate, onMarkComplete, isAdmin }) => {
  if (!node) return null;

  const handleChange = (field, value) => {
    if (!isAdmin) return;
    onUpdate(node.id, { [field]: value });
  };

  return (
    <div className="node-sidebar-overlay" onClick={onClose}>
      <div className="node-sidebar card" onClick={(e) => e.stopPropagation()}>
        <div className="sidebar-header">
          <h2>{isAdmin ? 'Edit Node' : node.data.title || 'Node Details'}</h2>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="sidebar-content">
          {isAdmin ? (
            <>
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={node.data.title || ''} 
                  onChange={(e) => handleChange('title', e.target.value)} 
                  placeholder="e.g., Introduction to React"
                />
              </div>
              
              <div className="form-group">
                <label>Type</label>
                <select 
                  className="form-control"
                  value={node.data.type || 'Topic Node'}
                  onChange={(e) => handleChange('type', e.target.value)}
                >
                  <option>Topic Node</option>
                  <option>Video Node</option>
                  <option>Quiz Node</option>
                  <option>Project Node</option>
                  <option>Notes Node</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  className="form-control" 
                  value={node.data.description || ''} 
                  onChange={(e) => handleChange('description', e.target.value)} 
                  placeholder="What will users learn?"
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Video URL (Optional)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={node.data.videoUrl || ''} 
                  onChange={(e) => handleChange('videoUrl', e.target.value)} 
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div className="form-group">
                <label>Difficulty</label>
                <select 
                  className="form-control"
                  value={node.data.difficulty || 'Beginner'}
                  onChange={(e) => handleChange('difficulty', e.target.value)}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label>Estimated Duration</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={node.data.duration || ''} 
                  onChange={(e) => handleChange('duration', e.target.value)} 
                  placeholder="e.g., 2 hours"
                />
              </div>
            </>
          ) : (
            <>
              <p className="text-secondary" style={{ lineHeight: '1.6' }}>
                {node.data.description || 'No description provided.'}
              </p>
              
              <div className="custom-node-meta" style={{ margin: '16px 0' }}>
                {node.data.duration && <span className="badge">⏱ {node.data.duration}</span>}
                {node.data.difficulty && <span className="badge">⚡ {node.data.difficulty}</span>}
                <span className="badge">{node.data.type || 'Topic'}</span>
              </div>

              {node.data.videoUrl && (
                <div className="video-preview">
                  <ReactPlayer 
                    url={node.data.videoUrl} 
                    width="100%" 
                    height="100%" 
                    controls 
                  />
                </div>
              )}
            </>
          )}
        </div>

        {!isAdmin && (
          <div className="sidebar-footer">
            <button 
              className={`btn-${node.data.isCompleted ? 'secondary' : 'primary'} w-100`}
              onClick={() => {
                if (onMarkComplete) onMarkComplete(node.id);
                else onUpdate(node.id, { isCompleted: true });
              }}
              disabled={node.data.isCompleted || node.data.isLocked}
            >
              {node.data.isCompleted ? '✓ Completed' : (node.data.isLocked ? 'Locked' : 'Mark as Completed')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeSidebar;
