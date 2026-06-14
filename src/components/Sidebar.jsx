import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LearningContext } from '../context/LearningContext';
import { AuthContext } from '../context/AuthContext';
import { Home, Compass, Library, MessageSquare, PlusCircle, X, Map, Award, FileText, Target, Bot, Lock } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ onOpenAI, isMobileOpen, closeMobileSidebar }) => {
  const { categories } = useContext(LearningContext);
  const { user } = useContext(AuthContext);

  return (
    <>
      {isMobileOpen && <div className="sidebar-backdrop" onClick={closeMobileSidebar}></div>}
      
      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {isMobileOpen && (
          <button className="icon-btn close-sidebar-btn" onClick={closeMobileSidebar}>
            <X size={24} />
          </button>
        )}
        
        <div className="sidebar-section">
          <h3 className="section-title">Menu</h3>
          <nav className="nav-menu">
            <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={closeMobileSidebar}>
              <Home size={18} />
              <span>Home</span>
            </NavLink>
            <NavLink to="/explore" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={closeMobileSidebar}>
              <Compass size={18} />
              <span>Explore</span>
            </NavLink>
            <NavLink to="/roadmaps" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={closeMobileSidebar}>
              <Map size={18} />
              <span>Roadmaps</span>
            </NavLink>
            <NavLink to={user ? "/library" : "/login"} className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={closeMobileSidebar}>
              <Library size={18} />
              <span>My Library</span>
              {!user && <Lock size={14} style={{marginLeft: 'auto', opacity: 0.5}} />}
            </NavLink>
            <NavLink to={user ? "/ai" : "/login"} className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={closeMobileSidebar}>
              <Bot size={18} />
              <span>AI Tutor</span>
              {!user && <Lock size={14} style={{marginLeft: 'auto', opacity: 0.5}} />}
            </NavLink>
            <NavLink to={user ? "/certificates" : "/login"} className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={closeMobileSidebar}>
              <Award size={18} />
              <span>My Certificates</span>
              {!user && <Lock size={14} style={{marginLeft: 'auto', opacity: 0.5}} />}
            </NavLink>
            <NavLink to={user ? "/resumes" : "/login"} className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={closeMobileSidebar}>
              <FileText size={18} />
              <span>Resume Builder</span>
              {!user && <Lock size={14} style={{marginLeft: 'auto', opacity: 0.5}} />}
            </NavLink>
            <NavLink to={user ? "/placement" : "/login"} className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={closeMobileSidebar}>
              <Target size={18} />
              <span>Placement Hub</span>
              {!user && <Lock size={14} style={{marginLeft: 'auto', opacity: 0.5}} />}
            </NavLink>
          </nav>
        </div>

        <div className="sidebar-section">
          <div className="section-header">
            <h3 className="section-title">Categories</h3>
            <button className="icon-btn"><PlusCircle size={16}/></button>
          </div>
          <div className="category-list">
            {categories.slice(0, 5).map(cat => (
              <div key={cat.id} className="category-item" onClick={closeMobileSidebar}>
                <span className="category-color" style={{backgroundColor: 'var(--accent-primary)'}}></span>
                <span className="category-name">{cat.title}</span>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="p-2 text-tertiary text-sm">No categories yet.</div>
            )}
          </div>
        </div>

        <div className="sidebar-bottom">
          <button className="btn-primary w-100 flex-center" onClick={() => { 
            if(!user) {
              window.location.href = '/login';
            } else {
              onOpenAI(); 
              closeMobileSidebar(); 
            }
          }}>
            <MessageSquare size={18} className="mr-2" />
            Ask AI
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
