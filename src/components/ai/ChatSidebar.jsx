import React from 'react';
import { Plus, MessageSquare } from 'lucide-react';

export default function ChatSidebar({ sessions, activeSessionId, onSelectSession, onNewChat }) {
  return (
    <div className="chat-sidebar">
      <div className="sidebar-header">
        <button className="new-chat-btn" onClick={onNewChat}>
          <Plus size={18} /> New Chat
        </button>
      </div>
      <div className="history-list">
        {sessions.map(session => (
          <button 
            key={session.id} 
            className={`history-item ${session.id === activeSessionId ? 'active' : ''}`}
            onClick={() => onSelectSession(session)}
          >
            <MessageSquare size={16} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {session.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
