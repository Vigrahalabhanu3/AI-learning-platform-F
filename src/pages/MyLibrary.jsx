import { useContext, useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LearningContext } from '../context/LearningContext';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, CheckCircle, Clock, TrendingUp, PlayCircle, Compass, Flame, Trophy } from 'lucide-react';
import Loader from '../components/Loader';
import './MyLibrary.css';

const CircularProgress = ({ progress, size = 50, strokeWidth = 4, colorClass = "text-primary" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="circular-progress-container" style={{ width: size, height: size }}>
      <svg className="circular-progress-svg" width={size} height={size}>
        <circle
          className="circular-progress-bg"
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`circular-progress-fill ${colorClass}`}
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="circular-progress-text text-xs font-bold">
        {progress}%
      </div>
    </div>
  );
};

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
};

const MyLibrary = () => {
  const { topics, loading } = useContext(LearningContext);
  const { userProfile, fetchUserProfile, token } = useContext(AuthContext);
  const [roadmaps, setRoadmaps] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  const fetchLibraryData = () => {
    if (token) {
      setApiStatus(apiStatusConstants.inProgress);
      fetchUserProfile(token);
      fetch(import.meta.env.VITE_API_URL + '/api/user/roadmaps/progress', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setRoadmaps(data);
        setApiStatus(apiStatusConstants.success);
      })
      .catch(error => {
        console.error("API Error:", error);
        setApiStatus(apiStatusConstants.failure);
      });
    } else {
      setApiStatus(apiStatusConstants.success);
    }
  };

  useEffect(() => {
    fetchLibraryData();
  }, [token]);

  // Calculate Metrics
  const metrics = useMemo(() => {
    const total = topics.length;
    if (total === 0) return { overallProgress: 0, completed: 0, inProgress: 0, notStarted: 0 };

    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;
    let sumProgress = 0;

    topics.forEach(t => {
      sumProgress += t.progress;
      if (t.progress === 100) completed++;
      else if (t.progress > 0) inProgress++;
      else notStarted++;
    });

    let totalRoadmapsCompleted = roadmaps.filter(r => r.progressPercentage === 100).length;
    let totalRoadmapsInProgress = roadmaps.filter(r => r.progressPercentage > 0 && r.progressPercentage < 100).length;

    return {
      overallProgress: total > 0 ? Math.round(sumProgress / total) : 0,
      completed: completed + totalRoadmapsCompleted,
      inProgress: inProgress + totalRoadmapsInProgress,
      notStarted
    };
  }, [topics, roadmaps]);

  // Filter lists
  const inProgressTopics = topics.filter(t => t.progress > 0 && t.progress < 100);
  const completedTopics = topics.filter(t => t.progress === 100);

  const inProgressRoadmaps = roadmaps.filter(r => r.progressPercentage > 0 && r.progressPercentage < 100);
  const completedRoadmaps = roadmaps.filter(r => r.progressPercentage === 100);

  const renderProgressView = () => (
    <div className="flex justify-center align-center" style={{ minHeight: '60vh' }}>
      <Loader />
    </div>
  );

  const renderFailureView = () => (
    <div className="empty-state text-center p-8 card" style={{ minHeight: '50vh' }}>
      <div className="text-error mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      </div>
      <h3 className="text-xl font-bold mb-2">Oops! Something went wrong</h3>
      <p className="text-secondary mb-6">We are having trouble fetching your library data right now. Please try again.</p>
      <button onClick={fetchLibraryData} className="btn-primary">Retry</button>
    </div>
  );

  const renderSuccessView = () => (
    <>
      <header className="library-header mb-6">
        <h1 className="text-2xl font-bold mb-2">My <span className="gradient-text">Library</span></h1>
        <p className="text-secondary text-sm">Track your learning progress and pick up right where you left off.</p>
      </header>

      {/* Metrics Dashboard */}
      <section className="metrics-grid mb-8">
        <div className="metric-card card p-4 flex flex-col justify-between">
          <div className="flex align-center justify-between mb-4">
            <h4 className="text-sm text-secondary font-semibold m-0">Overall Progress</h4>
            <TrendingUp size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold m-0">{metrics.overallProgress}%</h2>
            <div className="progress-bar-container mt-3">
              <div className="progress-bar-fill" style={{ width: `${metrics.overallProgress}%` }}></div>
            </div>
          </div>
        </div>

        <div className="metric-card card p-4 flex flex-col justify-between">
          <div className="flex align-center justify-between mb-4">
            <h4 className="text-sm text-secondary font-semibold m-0">Completed Topics</h4>
            <CheckCircle size={20} className="text-success" />
          </div>
          <h2 className="text-3xl font-bold m-0">{metrics.completed}</h2>
          <p className="text-xs text-tertiary mt-2">Awesome work! Keep it up.</p>
        </div>

        <div className="metric-card card p-4 flex flex-col justify-between">
          <div className="flex align-center justify-between mb-4">
            <h4 className="text-sm text-secondary font-semibold m-0">In Progress</h4>
            <Clock size={20} className="text-primary" />
          </div>
          <h2 className="text-3xl font-bold m-0">{metrics.inProgress}</h2>
          <p className="text-xs text-tertiary mt-2">Topics currently underway.</p>
        </div>

        <div className="metric-card card p-4 flex flex-col justify-between">
          <div className="flex align-center justify-between mb-4">
            <h4 className="text-sm text-secondary font-semibold m-0">Not Started</h4>
            <BookOpen size={20} className="text-secondary" />
          </div>
          <h2 className="text-3xl font-bold m-0">{metrics.notStarted}</h2>
          <p className="text-xs text-tertiary mt-2">Waiting to be explored.</p>
        </div>
      </section>

      {/* Continue Learning Section */}
      {inProgressTopics.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-4 flex align-center gap-2"><PlayCircle size={22} className="text-primary"/> Continue Learning</h3>
          <div className="topic-grid">
            {inProgressTopics.map(topic => (
              <Link to={`/topic/${topic.id}`} key={topic.id} className="topic-card card p-4 google-border-hover flex-row align-center justify-between">
                <div className="overflow-hidden pr-4">
                  <h4 className="font-semibold text-md mb-1 truncate">{topic.title}</h4>
                  <span className="text-xs text-secondary">{topic.videos?.length || 0} Videos</span>
                </div>
                <CircularProgress progress={topic.progress} size={48} strokeWidth={4} colorClass="text-primary" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Completed Courses Section */}
      {completedTopics.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-4 flex align-center gap-2"><CheckCircle size={22} className="text-success"/> Completed Topics</h3>
          <div className="topic-grid">
            {completedTopics.map(topic => (
              <Link to={`/topic/${topic.id}`} key={topic.id} className="topic-card card p-4 opacity-80 hover:opacity-100 transition-opacity flex-row align-center justify-between">
                <div className="overflow-hidden pr-4">
                  <h4 className="font-semibold text-md mb-1 truncate">{topic.title}</h4>
                  <span className="text-xs text-secondary flex align-center gap-1">Finished <CheckCircle size={12} className="text-success" /></span>
                </div>
                <CircularProgress progress={100} size={48} strokeWidth={4} colorClass="text-success" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Roadmaps Section */}
      {inProgressRoadmaps.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-4 flex align-center gap-2"><PlayCircle size={22} className="text-accent"/> Continue Roadmaps</h3>
          <div className="topic-grid">
            {inProgressRoadmaps.map(rm => (
              <Link to={`/roadmap/${rm.slug}`} key={rm.roadmapId} className="topic-card card p-4 google-border-hover flex-row align-center justify-between">
                <div className="overflow-hidden pr-4">
                  <h4 className="font-semibold text-md mb-1 truncate">{rm.title}</h4>
                  <span className="text-xs text-secondary">Roadmap</span>
                </div>
                <CircularProgress progress={rm.progressPercentage} size={48} strokeWidth={4} colorClass="text-accent" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Completed Roadmaps Section */}
      {completedRoadmaps.length > 0 && (
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-4 flex align-center gap-2"><CheckCircle size={22} className="text-success"/> Completed Roadmaps</h3>
          <div className="topic-grid">
            {completedRoadmaps.map(rm => (
              <Link to={`/roadmap/${rm.slug}`} key={rm.roadmapId} className="topic-card card p-4 opacity-80 hover:opacity-100 transition-opacity flex-row align-center justify-between">
                <div className="overflow-hidden pr-4">
                  <h4 className="font-semibold text-md mb-1 truncate">{rm.title}</h4>
                  <span className="text-xs text-secondary flex align-center gap-1">Finished <CheckCircle size={12} className="text-success" /></span>
                </div>
                <CircularProgress progress={100} size={48} strokeWidth={4} colorClass="text-success" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {(topics.length === 0 && roadmaps.length === 0) && (
        <div className="empty-state text-center p-8 card">
          <BookOpen size={48} className="text-tertiary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Topics Available</h3>
          <p className="text-secondary text-sm">Head over to the Admin Dashboard to create some topics!</p>
        </div>
      )}

      {(topics.length > 0 || roadmaps.length > 0) && metrics.completed === 0 && metrics.inProgress === 0 && (
        <div className="empty-state text-center p-8 card mt-6">
          <Compass size={48} className="text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Start Your Journey!</h3>
          <p className="text-secondary text-sm mb-4">You haven't started any courses or roadmaps yet. Go back home and explore!</p>
          <Link to="/" className="btn-primary inline-flex align-center gap-2"><PlayCircle size={18}/> Explore Content</Link>
        </div>
      )}
    </>
  );

  const renderContent = () => {
    if (loading || apiStatus === apiStatusConstants.inProgress) {
      return renderProgressView();
    }

    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderSuccessView();
      case apiStatusConstants.failure:
        return renderFailureView();
      default:
        return null;
    }
  };

  return (
    <div className="library-page">
      {renderContent()}
    </div>
  );
};

export default MyLibrary;
