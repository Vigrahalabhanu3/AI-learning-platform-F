import { createContext, useState, useEffect } from 'react';


export const LearningContext = createContext();

export const LearningProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showConfetti, setShowConfetti] = useState(false);

  const [aiChatHistory, setAiChatHistory] = useState(() => {
    const saved = localStorage.getItem('ai_chat_history');
    return saved ? JSON.parse(saved) : [];
  });

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000); // Stop after 5 seconds
  };

  // Fetch topics from Express Backend
  const fetchTopics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const [topicsRes, categoriesRes] = await Promise.all([
        fetch(import.meta.env.VITE_API_URL + '/api/topics', { headers }),
        fetch(import.meta.env.VITE_API_URL + '/api/categories')
      ]);
      
      if (!topicsRes.ok) throw new Error('Failed to fetch topics');
      if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
      
      const topicsData = await topicsRes.json();
      const categoriesData = await categoriesRes.json();
      
      setTopics(topicsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch topics on initial mount
  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    localStorage.setItem('ai_chat_history', JSON.stringify(aiChatHistory));
  }, [aiChatHistory]);

  const updateTopicNotes = async (topicId, newNotes) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/topics/${topicId}/notes`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ notes: newNotes })
      });
      if (res.ok) {
        setTopics(prev => prev.map(t => t.id === topicId ? { ...t, notes: newNotes } : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const markVideoCompleted = async (topicId, videoId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/topics/${topicId}/complete-video`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ videoId })
      });
      if (res.ok) {
        const updatedTopic = await res.json();
        setTopics(prev => prev.map(t => t.id === topicId ? { ...t, progress: updatedTopic.progress, completedVideos: updatedTopic.completedVideos } : t));
        triggerConfetti();
        return updatedTopic;
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const addAiMessage = (role, content) => {
    setAiChatHistory(prev => [...prev, { role, content, timestamp: new Date().toISOString() }]);
  };

  const addCategory = async (title) => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/categories', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ title })
      });
      if (res.ok) {
        const newCat = await res.json();
        setCategories(prev => [...prev, newCat]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateCategory = async (categoryId, title) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ title })
      });
      if (res.ok) {
        const updatedCat = await res.json();
        setCategories(prev => prev.map(c => c.id === categoryId ? updatedCat : c));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (res.ok) {
        setCategories(prev => prev.filter(c => c.id !== categoryId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addTopic = async (title, categoryId) => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/topics', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ title, categoryId, description: 'New Topic Description' })
      });
      if (res.ok) {
        const newTopic = await res.json();
        // ensure videos etc are present for UI
        setTopics(prev => [...prev, { ...newTopic, videos: [], resources: [], quizzes: [] }]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTopic = async (topicId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/topics/${topicId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (res.ok) {
        setTopics(prev => prev.filter(t => t.id !== topicId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateTopicDetails = async (topicId, data) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/topics/${topicId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setTopics(prev => prev.map(t => t.id === topicId ? { ...t, ...data } : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addVideo = async (topicId, videoData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/topics/${topicId}/videos`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(videoData)
      });
      if (res.ok) {
        const newVideo = await res.json();
        setTopics(prev => prev.map(t => t.id === topicId ? { ...t, videos: [...t.videos, newVideo] } : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteVideo = async (topicId, videoId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/videos/${videoId}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (res.ok) {
        setTopics(prev => prev.map(t => t.id === topicId ? { ...t, videos: t.videos.filter(v => v.id !== videoId) } : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateVideo = async (topicId, videoId, videoData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/videos/${videoId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(videoData)
      });
      if (res.ok) {
        const updatedVideo = await res.json();
        setTopics(prev => prev.map(t => t.id === topicId ? { ...t, videos: t.videos.map(v => v.id === videoId ? updatedVideo : v) } : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addResource = async (topicId, resourceData) => {
    try {
      const isFormData = resourceData instanceof FormData;
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` };
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }
      
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/topics/${topicId}/resources`, {
        method: 'POST',
        headers,
        body: isFormData ? resourceData : JSON.stringify(resourceData)
      });
      if (res.ok) {
        const newRes = await res.json();
        setTopics(prev => prev.map(t => t.id === topicId ? { ...t, resources: [...t.resources, newRes] } : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteResource = async (topicId, resourceId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/resources/${resourceId}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (res.ok) {
        setTopics(prev => prev.map(t => t.id === topicId ? { ...t, resources: t.resources.filter(r => r.id !== resourceId) } : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateResource = async (topicId, resourceId, formData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/resources/${resourceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: formData
      });
      if (res.ok) {
        const updatedResource = await res.json();
        setTopics(prev => prev.map(t => t.id === topicId ? { ...t, resources: t.resources.map(r => r.id === resourceId ? updatedResource : r) } : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addQuiz = async (topicId, quizData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/topics/${topicId}/quizzes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(quizData)
      });
      if (res.ok) {
        const newQuiz = await res.json();
        setTopics(prev => prev.map(t => t.id === topicId ? { ...t, quizzes: [...(t.quizzes || []), newQuiz] } : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteQuiz = async (topicId, quizId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/quizzes/${quizId}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      if (res.ok) {
        setTopics(prev => prev.map(t => t.id === topicId ? { ...t, quizzes: t.quizzes.filter(q => q.id !== quizId) } : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <LearningContext.Provider value={{ 
      categories, 
      topics, 
      loading, 
      fetchTopics,
      aiChatHistory,
      setAiChatHistory,
      addAiMessage,
      updateTopicNotes, 
      markVideoCompleted,
      addCategory,
      triggerConfetti,
      showConfetti,
      updateCategory,
      deleteCategory,
      addTopic,
      deleteTopic,
      updateTopicDetails,
      addVideo,
      deleteVideo,
      updateVideo,
      addResource,
      deleteResource,
      updateResource,
      addQuiz,
      deleteQuiz
    }}>
      {children}
    </LearningContext.Provider>
  );
};
