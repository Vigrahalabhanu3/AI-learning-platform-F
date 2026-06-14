import React, { useState, useEffect, useRef, useContext } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import ChatSidebar from '../../components/ai/ChatSidebar';
import MessageBubble from '../../components/ai/MessageBubble';
import './AIAssistantDashboard.css';

export default function AIAssistantDashboard() {
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ai/chat/history?userEmail=${user.email}`);
      const data = await res.json();
      if (res.ok) {
        setSessions(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSelectSession = (session) => {
    setActiveSession(session);
    setMessages(session.AIChatMessages || []);
  };

  const handleNewChat = () => {
    setActiveSession(null);
    setMessages([]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const query = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setLoading(true);

    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          userEmail: user.email,
          sessionId: activeSession ? activeSession.id : null
        })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'model', content: data.response, citations: data.citations }]);
        if (!activeSession) {
          fetchHistory(); // Refresh sidebar to get new session
        }
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-dashboard fade-in">
      <ChatSidebar 
        sessions={sessions} 
        activeSessionId={activeSession?.id} 
        onSelectSession={handleSelectSession} 
        onNewChat={handleNewChat} 
      />
      
      <div className="chat-main">
        {messages.length === 0 ? (
          <div className="welcome-screen">
            <h2>AI Tutor</h2>
            <p className="text-secondary">Ask questions about courses, roadmaps, and assignments.</p>
            <p className="text-secondary" style={{ fontSize: '0.9rem' }}>The AI retrieves knowledge directly from the platform's material.</p>
          </div>
        ) : (
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} msg={msg} />
            ))}
            {loading && (
              <div className="message-wrapper model">
                <div className="avatar model"><Loader2 size={20} className="spin" /></div>
                <div className="message-content">Thinking... Searching knowledge base...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="chat-input-area">
          <form className="input-container" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Ask a doubt... (e.g. 'Explain Python loops')"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="send-btn" disabled={!input.trim() || loading}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
