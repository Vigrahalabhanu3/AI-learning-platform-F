import React from 'react';
import { Bot, User, BookOpen } from 'lucide-react';
// Since we don't have a markdown parser package installed in frontend right now,
// we will just do basic rendering, but in a real app you'd use 'react-markdown'.

export default function MessageBubble({ msg }) {
  return (
    <div className={`message-wrapper ${msg.role}`}>
      <div className={`avatar ${msg.role}`}>
        {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
      </div>
      <div className="message-content">
        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
        
        {msg.citations && msg.citations.length > 0 && (
          <div className="citations-box">
            <strong>Sources cited:</strong><br />
            {msg.citations.map((cit, idx) => (
              <span key={idx} className="citation-chip" title={cit.textSnippet}>
                <BookOpen size={14} />
                {cit.title}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
