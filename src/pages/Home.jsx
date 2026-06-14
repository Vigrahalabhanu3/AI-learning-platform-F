import { useContext } from 'react';
import { LearningContext } from '../context/LearningContext';
import { AuthContext } from '../context/AuthContext';
import * as Icons from 'lucide-react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import './Home.css';

const Home = () => {
  const { categories, topics, loading } = useContext(LearningContext);
  const { user } = useContext(AuthContext);

  if (loading) return <Loader />;

  const renderIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent size={24} /> : <Icons.Book size={24} />;
  };

  return (
    <div className="home-page">
      <section className="hero-section glass">
        <div className="hero-content">
          {user ? (
            <>
              <h1>Welcome back, <span className="gradient-text">Learner</span></h1>
              <p>Ready to master something new today? Pick up where you left off or explore new topics.</p>
              <div className="hero-stats">
                <div className="stat-card">
                  <span className="stat-value">12</span>
                  <span className="stat-label">Topics Completed</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">45h</span>
                  <span className="stat-label">Learning Time</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">3</span>
                  <span className="stat-label">Certificates</span>
                </div>
              </div>
              <div style={{marginTop: '2rem'}}>
                <Link to="/explore" className="btn-primary" style={{marginRight: '1rem', textDecoration: 'none'}}>Explore Courses</Link>
                <Link to="/library" className="btn-outline" style={{textDecoration: 'none'}}>My Library</Link>
              </div>
            </>
          ) : (
            <>
              <h1>Start Your <span className="gradient-text">Learning Journey</span></h1>
              <p>Master the most in-demand skills with our interactive roadmaps, personalized AI tutor, and comprehensive learning paths.</p>
              <div style={{marginTop: '2rem'}}>
                <Link to="/register" className="btn-primary" style={{marginRight: '1rem', textDecoration: 'none'}}>Get Started for Free</Link>
                <Link to="/explore" className="btn-outline" style={{textDecoration: 'none'}}>Browse Catalog</Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="categories-section">
        <h2 className="section-title">Explore Categories</h2>
        <div className="categories-grid">
          {categories.map(category => {
            const topicCount = topics.filter(t => t.categoryId === category.id).length;
            return (
              <Link 
                key={category.id} 
                to={`/explore?category=${encodeURIComponent(category.title)}`} 
                className="glass-panel category-card google-border-hover"
              >
                <div className="category-icon-wrapper">
                  <Icons.BookOpen size={24} />
                </div>
                <div className="category-info">
                  <h3>{category.title}</h3>
                  <p>{topicCount} topics</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="recent-topics">
        <h2 className="section-title">Continue Learning</h2>
        <div className="topics-list">
          {topics.map(topic => {
            const content = (
              <div className="topic-content">
                <div className="flex justify-between align-center">
                  <h3>{topic.title}</h3>
                  {topic.isLocked && <Icons.Lock size={18} className="text-secondary" />}
                </div>
                <p>{topic.description}</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${topic.progress}%` }}></div>
                </div>
                <span className="progress-text">{topic.progress}% Completed</span>
              </div>
            );

            if (topic.isLocked) {
              return (
                <div key={topic.id} className="topic-card card locked" title="This course is locked">
                  {content}
                </div>
              );
            }

            return (
              <Link 
                key={topic.id} 
                to={`/topic/${topic.id}`} 
                className="glass-panel topic-card google-border-hover"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
