import { useState, useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LearningContext } from '../context/LearningContext';
import { AuthContext } from '../context/AuthContext';
import VideoPlayer from '../components/VideoPlayer';
import NotesEditor from '../components/NotesEditor';
import Quiz from '../components/Quiz';
import Loader from '../components/Loader';
import { FileText, Headphones, Image as ImageIcon, CheckCircle, ChevronLeft, Lock, X, Flame, Trophy, PlayCircle } from 'lucide-react';
import './TopicPage.css';

const TopicPage = () => {
  const { id } = useParams();
  const { topics, updateTopicNotes, markVideoCompleted, loading } = useContext(LearningContext);
  const { fetchUserProfile, userProfile } = useContext(AuthContext);
  
  if (loading) return <Loader />;

  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('notes'); // notes, quiz, resources
  const [streakModalData, setStreakModalData] = useState(null);
  
  const topic = topics.find(t => t.id === id);

  useEffect(() => {
    // scroll to top on mount
    window.scrollTo(0, 0);
  }, [id]);

  if (!topic) {
    return <div className="page-container"><h2>Topic not found.</h2></div>;
  }

  if (topic.isLocked) {
    return (
      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
        <div style={{ padding: '3rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '24px', maxWidth: '500px', border: '1px solid var(--border-color)' }}>
          <Lock size={48} className="text-secondary mb-4 mx-auto" />
          <h2 className="mb-2">Course Locked</h2>
          <p className="text-secondary mb-6">This course is currently locked by the admin and cannot be accessed. Please check back later or contact support.</p>
          <Link to="/" className="btn-primary inline-block">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  const sortedVideos = (topic && Array.isArray(topic.videos)) ? [...topic.videos].sort((a, b) => (a.serialNumber || 0) - (b.serialNumber || 0)) : [];
  const currentVideo = sortedVideos.length > 0 ? sortedVideos[currentVideoIdx] : null;
  const completedCount = topic?.completedVideos ? topic.completedVideos.length : 0;
  const isCompleted = topic?.completedVideos && currentVideo ? topic.completedVideos.includes(currentVideo.id) : false;

  const handleVideoEnded = async () => {
    const updatedTopic = await markVideoCompleted(topic.id, currentVideo.id);
    await fetchUserProfile(localStorage.getItem('auth_token'));
    
    if (updatedTopic && updatedTopic.streakUpdated) {
      setStreakModalData({
        date: new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      });
    }
    
    handleNextVideo();
  };

  const handleNextVideo = () => {
    if (currentVideoIdx < sortedVideos.length - 1) {
      setCurrentVideoIdx(prev => prev + 1);
    }
  };

  const handlePrevVideo = () => {
    if (currentVideoIdx > 0) {
      setCurrentVideoIdx(prev => prev - 1);
    }
  };

  const handleNotesSave = (newNotes) => {
    updateTopicNotes(topic.id, newNotes);
  };

  const generateAI = async () => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/ai/generate-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: currentVideo?.url, topicId: topic.id })
      });
      const data = await res.json();
      if (data.notes) {
        updateTopicNotes(topic.id, topic.notes + "\n\n### AI Summary\n\n" + data.notes);
      }
    } catch(err) {
      console.error(err);
    }
  };

  const renderResourceIcon = (type) => {
    switch(type) {
      case 'pdf': return <FileText size={20} />;
      case 'audio': return <Headphones size={20} />;
      case 'infographic': return <ImageIcon size={20} />;
      default: return <FileText size={20} />;
    }
  };

  return (
    <div className="topic-page relative">
      {/* Streak Modal */}
      {streakModalData && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content card glass p-8" style={{ width: '400px', maxWidth: '90%', textAlign: 'center', position: 'relative', animation: 'popIn 0.3s ease-out' }}>
            <button className="icon-btn" onClick={() => setStreakModalData(null)} style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
              <X size={20} className="text-secondary" />
            </button>
            <div className="mb-6 flex justify-center">
              <div style={{ background: 'rgba(249, 115, 22, 0.1)', padding: '1rem', borderRadius: '50%' }}>
                <Flame size={48} className="text-orange-500" style={{color: '#f97316'}}/>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Streak Updated!</h2>
            <p className="text-secondary text-sm mb-6">{streakModalData.date}</p>
            
            <div className="flex justify-center gap-8 mb-6">
              <div className="text-center">
                <p className="text-xs text-tertiary uppercase tracking-wider mb-1">Current Streak</p>
                <p className="text-3xl font-bold flex align-center justify-center gap-1"><Flame size={24} className="text-orange-500" style={{color: '#f97316'}}/> {userProfile?.currentStreak || 1}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-tertiary uppercase tracking-wider mb-1">Highest Streak</p>
                <p className="text-3xl font-bold flex align-center justify-center gap-1"><Trophy size={24} className="text-yellow-500" style={{color: '#eab308'}}/> {userProfile?.highestStreak || 1}</p>
              </div>
            </div>
            
            <button className="btn-primary w-full" onClick={() => setStreakModalData(null)}>Awesome!</button>
          </div>
        </div>
      )}

      <div className="topic-header">
        <Link to="/" className="back-link">
          <ChevronLeft size={20} /> Back to Dashboard
        </Link>
        <div className="topic-title-area">
          <h1>{topic.title}</h1>
          <div className="topic-progress-badge">
            {topic.progress === 100 ? <CheckCircle size={18} className="text-success" /> : null}
            <span>{topic.progress}% Completed</span>
          </div>
        </div>
      </div>

      <div className="topic-content-grid">
        <div className="main-column">
          {currentVideo ? (
            <VideoPlayer 
              url={currentVideo.url} 
              title={currentVideo.title}
              onEnded={handleVideoEnded}
              onNext={handleNextVideo}
              onPrev={handlePrevVideo}
              isCompleted={isCompleted}
              onMarkCompleted={handleVideoEnded}
            />
          ) : (
            <div className="card p-4 text-center">No videos available.</div>
          )}

          <div className="topic-tabs">
            <button className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>Notes</button>
            <button className={`tab-btn ${activeTab === 'materials' ? 'active' : ''}`} onClick={() => setActiveTab('materials')}>Course Materials</button>
          </div>

          <div className="tab-content">
            {activeTab === 'notes' && (
              <NotesEditor 
                initialNotes={topic.notes} 
                onSave={handleNotesSave}
                onGenerateAI={generateAI}
              />
            )}
            {activeTab === 'materials' && (
              <div className="materials-container flex flex-col gap-6">
                
                {topic.quizzes && topic.quizzes.length > 0 && (
                  <div className="materials-section">
                    <h3 className="text-xl font-bold mb-4 flex align-center gap-2">
                      <CheckCircle size={20} className="text-accent"/> Assessments
                    </h3>
                    <Quiz quizzes={topic.quizzes} />
                  </div>
                )}

                <div className="materials-section">
                  <h3 className="text-xl font-bold mb-4 flex align-center gap-2">
                    <FileText size={20} className="text-accent"/> Learning Resources
                  </h3>
                  <div className="resources-grid">
                    {topic.resources && topic.resources.length > 0 ? topic.resources.map(res => (
                      <div key={res.id} className={`resource-card card google-border-hover ${res.type === 'infographic' ? 'p-0' : ''}`}>
                        {res.type === 'infographic' && (
                          <div className="resource-card-image">
                            <img src={res.url} alt={res.title} />
                            <div className="resource-card-overlay">
                              <a href={res.url} target="_blank" rel="noreferrer" className="btn-primary">View Full Image</a>
                            </div>
                          </div>
                        )}
                        <div className={res.type === 'infographic' ? 'resource-content' : 'w-full'}>
                          <div className="flex align-center gap-3 w-full">
                            <div className="resource-icon" data-type={res.type}>
                              {renderResourceIcon(res.type)}
                            </div>
                            <div className="resource-info flex-1">
                              <h4 className="m-0 text-md font-semibold">{res.title}</h4>
                              <span className="resource-type text-xs text-secondary">{res.type.toUpperCase()}</span>
                            </div>
                            {res.type === 'pdf' && (
                              <a href={res.url} target="_blank" rel="noreferrer" className="btn-secondary sm">View PDF</a>
                            )}
                          </div>
                          {res.type === 'audio' && (
                            <div className="w-full mt-3">
                              <audio controls src={res.url} className="w-full" style={{ height: '40px' }} />
                            </div>
                          )}
                        </div>
                      </div>
                    )) : (
                      <p className="text-tertiary p-4 card text-center">No additional resources available for this topic.</p>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

        <div className="side-column">
          <div className="playlist-card card google-border-hover">
            <h3 className="playlist-title">Playlist</h3>
            <div className="playlist-items">
              {sortedVideos?.map((vid, idx) => (
                <div 
                  key={vid.id} 
                  className={`playlist-item ${idx === currentVideoIdx ? 'active' : ''}`}
                  onClick={() => setCurrentVideoIdx(idx)}
                >
                  <div className="playlist-item-num">
                    {idx === currentVideoIdx ? (
                      <PlayCircle size={18} className="text-accent spin-slow-pulse" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <div className="playlist-item-info">
                    <h4>{vid.title}</h4>
                    <span>{vid.duration}</span>
                  </div>
                  {topic.completedVideos?.includes(vid.id) && <CheckCircle size={16} className="text-success ml-auto" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicPage;
