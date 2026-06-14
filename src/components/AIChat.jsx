import { useState, useContext, useRef, useEffect } from 'react';
import { LearningContext } from '../context/LearningContext';
import { Send, Bot, User, X } from 'lucide-react';
import './AIChat.css';

const AIChat = ({ isOpen, onClose }) => {
  const { aiChatHistory, addAiMessage } = useContext(LearningContext);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiChatHistory, isTyping, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    addAiMessage('user', userMessage);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: aiChatHistory })
      });
      const data = await res.json();
      if (data.reply) {
        addAiMessage('ai', data.reply);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ai-chat-panel glass">
      <div className="ai-chat-header">
        <div className="ai-header-info">
          <Bot size={24} className="text-accent" />
          <h3>AI Learning Assistant</h3>
        </div>
        <button className="icon-btn" onClick={onClose}><X size={20} /></button>
      </div>

      <div className="ai-chat-messages">
        {aiChatHistory.length === 0 ? (
          <div className="empty-chat">
            <Bot size={48} className="text-tertiary mb-2" />
            <p>Ask me anything about your courses, topics, or request a quiz!</p>
          </div>
        ) : (
          aiChatHistory.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role}`}>
              <div className="chat-avatar">
                {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className="chat-content">
                {msg.content}
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="chat-message ai">
            <div className="chat-avatar"><Bot size={16} /></div>
            <div className="chat-content typing-indicator">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-chat-input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask a question..."
          rows={1}
        />
        <button 
          className="btn-primary icon-only" 
          onClick={handleSend}
          disabled={!input.trim()}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AIChat;
