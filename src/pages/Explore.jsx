import { useContext, useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LearningContext } from '../context/LearningContext';
import { Search, Compass, PlayCircle } from 'lucide-react';
import Loader from '../components/Loader';
import './Explore.css';

const Explore = () => {
  const { categories, topics, loading } = useContext(LearningContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter topics based on search and category
  const filteredTopics = useMemo(() => {
    return topics.filter(topic => {
      const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (topic.description && topic.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (activeCategory === 'All') return matchesSearch;
      
      const category = categories.find(c => c.id === topic.categoryId);
      const matchesCategory = category && category.title === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [topics, searchQuery, activeCategory, categories]);

  if (loading) return <Loader />;

  return (
    <div className="explore-page">
      <header className="explore-header mb-8 text-center">
        <Compass size={40} className="text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-3">Explore <span className="gradient-text">Topics</span></h1>
        <p className="text-secondary max-w-2xl mx-auto">Discover new courses, expand your knowledge, and learn something new today.</p>
        
        {/* Search Bar */}
        <div className="search-container mt-6 max-w-lg mx-auto relative">
          <Search className="search-icon text-tertiary" size={20} />
          <input 
            type="text" 
            placeholder="Search for topics, skills, or keywords..." 
            className="input-field search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Category Filters */}
      <section className="category-filters mb-8 flex justify-center gap-2 flex-wrap">
        <button 
          className={`filter-btn ${activeCategory === 'All' ? 'active' : ''}`}
          onClick={() => setActiveCategory('All')}
        >
          All Topics
        </button>
        {categories.map(cat => (
          <button 
            key={cat.id} 
            className={`filter-btn ${activeCategory === cat.title ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.title)}
          >
            {cat.title}
          </button>
        ))}
      </section>

      {/* Topics Grid */}
      <section className="catalog-grid">
        {filteredTopics.length > 0 ? filteredTopics.map(topic => {
          const category = categories.find(c => c.id === topic.categoryId);
          return (
            <Link to={`/topic/${topic.id}`} key={topic.id} className="catalog-card card google-border-hover">
              <div className="catalog-card-image bg-primary flex align-center justify-center">
                <PlayCircle size={48} className="text-white opacity-80" />
              </div>
              <div className="catalog-card-content p-4">
                <div className="flex justify-between align-center mb-2">
                  <span className="category-badge text-xs font-semibold">{category?.title || 'Uncategorized'}</span>
                  <span className="text-xs text-secondary">{topic.videos?.length || 0} Videos</span>
                </div>
                <h3 className="text-lg font-bold mb-2 truncate">{topic.title}</h3>
                <p className="text-sm text-secondary truncate-2-lines">{topic.description}</p>
                <div className="mt-4 flex justify-between align-center">
                  <span className="text-xs font-semibold text-primary">{topic.progress}% Completed</span>
                </div>
              </div>
            </Link>
          );
        }) : (
          <div className="col-span-full text-center p-8">
            <h3 className="text-lg font-semibold text-secondary mb-2">No topics found</h3>
            <p className="text-tertiary text-sm">Try adjusting your search or selecting a different category.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Explore;
