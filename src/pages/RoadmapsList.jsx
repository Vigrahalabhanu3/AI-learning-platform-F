import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Map, ArrowRight, Search } from 'lucide-react';
import Loader from '../components/Loader';
import './RoadmapsList.css';

const RoadmapsList = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + '/api/roadmaps');
        if (res.ok) {
          const data = await res.json();
          setRoadmaps(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="roadmaps-page-container">
      <header className="roadmaps-header text-center mb-10 mt-6">
        <div className="icon-wrapper mx-auto mb-4">
          <Map size={36} className="text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Guided <span className="gradient-text">Roadmaps</span></h1>
        <p className="text-secondary max-w-2xl mx-auto text-lg mb-8">Follow structured learning paths curated by experts to master complex topics step-by-step.</p>
      </header>

      <section className="roadmaps-section pb-16">
        <div className="compact-card-grid">
          {roadmaps.map((rm, index) => (
            <Link to={`/roadmap/${rm.slug}`} key={rm.id} className="compact-row-card google-border-hover" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="card-left-content">
                <span className="google-chip mb-2">{rm.category || 'General'}</span>
                <h3 className="card-title font-semibold text-md mb-1 truncate">{rm.title}</h3>
                <p className="card-description text-xs text-secondary truncate">{rm.description || 'Follow this structured learning path.'}</p>
              </div>
              <div className="card-right-content">
                <div className="small-icon-btn">
                   <ArrowRight size={18} className="text-primary" />
                </div>
              </div>
            </Link>
          ))}
          
          {roadmaps.length === 0 && (
            <div className="empty-state-container col-span-full">
              <div className="empty-state-glass">
                <Search size={40} className="text-tertiary mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2">No roadmaps found</h3>
                <p className="text-secondary">No roadmaps have been created yet.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default RoadmapsList;
