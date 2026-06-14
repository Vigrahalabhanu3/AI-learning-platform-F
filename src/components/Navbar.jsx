import { useContext, useState, useMemo, useRef, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Sun, Moon, Search, BookOpen, Settings, Flame, Trophy, Menu, MoreVertical, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { user, userProfile, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isStreakOpen, setIsStreakOpen] = useState(false);
  const [isMobileActionsOpen, setIsMobileActionsOpen] = useState(false);
  const streakRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (streakRef.current && !streakRef.current.contains(event.target)) {
        setIsStreakOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileActionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activityGrid = useMemo(() => {
    const grid = [];
    const history = userProfile?.activityHistory || [];
    for (let i = 83; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-CA');
      grid.push({
        date: dateStr,
        active: history.includes(dateStr)
      });
    }
    return grid;
  }, [userProfile]);

  return (
    <nav className="navbar glass">
      <div className="navbar-brand">
        <button className="icon-btn mobile-menu-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <Link to="/" className="logo">
          <BookOpen className="logo-icon" />
          <span className="gradient-text">AILearn</span>
        </Link>
      </div>
      
      <div className="navbar-search">
        <Search className="search-icon" size={18} />
        <input type="text" placeholder="Search topics, videos, notes..." className="search-input" />
      </div>

      <div className="navbar-actions desktop-actions">
        {user?.role === 'admin' && (
          <Link to="/admin" className="icon-btn" title="Admin Dashboard">
            <Settings size={20} />
          </Link>
        )}
        
        {userProfile && (
          <div className="streak-container" ref={streakRef}>
            <button className="streak-btn" onClick={() => setIsStreakOpen(!isStreakOpen)}>
              <Flame size={18} /> {userProfile.currentStreak || 0}
            </button>
            
            {isStreakOpen && (
              <div className="streak-popover glass">
                <div className="streak-popover-header">
                  <div>
                    <h3 className="streak-popover-title">
                      <Flame size={20} className="text-orange-500" style={{color: '#f97316'}}/> 
                      Learning Streak
                    </h3>
                    <p className="streak-popover-subtitle">Keep it up to build your streak!</p>
                  </div>
                  <div style={{
                    width: '36px', height: '28px', 
                    background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)', 
                    borderRadius: '6px', 
                    border: '1px solid #7c5a08',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{position:'absolute', top:'50%', left:0, right:0, height:'1px', background:'rgba(0,0,0,0.2)'}}></div>
                    <div style={{position:'absolute', left:'50%', top:0, bottom:0, width:'1px', background:'rgba(0,0,0,0.2)'}}></div>
                  </div>
                </div>
                
                <div className="streak-stats-row">
                  <div className="streak-stat-mini">
                    <span>Current</span>
                    <span><Flame size={16} className="text-orange-500" style={{color: '#f97316'}}/> {userProfile.currentStreak || 0}</span>
                  </div>
                  <div className="streak-stat-mini">
                    <span>Highest</span>
                    <span><Trophy size={16} className="text-yellow-500" style={{color: '#eab308'}}/> {userProfile.highestStreak || 0}</span>
                  </div>
                </div>

                <div className="activity-grid-wrapper">
                  <div className="activity-grid" style={{
                    gridTemplateColumns: 'repeat(12, 12px)', 
                    gridTemplateRows: 'repeat(7, 12px)',
                    gridAutoFlow: 'column'
                  }}>
                    {activityGrid.map((cell, idx) => (
                      <div 
                        key={idx} 
                        className={`activity-cell ${cell.active ? 'active' : ''}`}
                        title={cell.date + (cell.active ? ' - Completed a topic' : '')}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {user ? (
          <>
            <button onClick={toggleTheme} className="icon-btn theme-toggle">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={handleLogout} className="icon-btn text-danger" title="Logout">
              <LogOut size={20} />
            </button>
            <Link to="/profile" className="user-avatar" title={`${user?.email} - View Profile`}>
              <img src={`https://ui-avatars.com/api/?name=${user?.email?.charAt(0) || 'U'}&background=6366f1&color=fff`} alt="User Profile" />
            </Link>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: '1rem' }}>
            <button onClick={toggleTheme} className="icon-btn theme-toggle" style={{marginRight: '0.5rem'}}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 500, padding: '0.5rem 1rem' }}>Log in</Link>
            <Link to="/register" style={{ background: 'var(--accent-primary)', color: '#fff', textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600 }}>Sign up</Link>
          </div>
        )}
      </div>

      <div className="navbar-actions mobile-actions" ref={mobileMenuRef}>
        <button className="icon-btn" onClick={() => setIsMobileActionsOpen(!isMobileActionsOpen)}>
          <MoreVertical size={24} />
        </button>

        {isMobileActionsOpen && (
          <div className="mobile-actions-dropdown glass">
            <Link to="/profile" className="mobile-action-item profile-info" onClick={() => setIsMobileActionsOpen(false)} style={{ textDecoration: 'none' }}>
              <img src={`https://ui-avatars.com/api/?name=${user?.email?.charAt(0) || 'U'}&background=6366f1&color=fff`} alt="User Profile" />
              <span>{user?.email}</span>
            </Link>

            {userProfile && (
              <div className="mobile-action-item">
                <Flame size={20} className="text-orange-500" />
                <span>{userProfile.currentStreak || 0} Day Streak</span>
              </div>
            )}
            
            {user?.role === 'admin' && (
              <Link to="/admin" className="mobile-action-item" onClick={() => setIsMobileActionsOpen(false)}>
                <Settings size={20} /> Admin Dashboard
              </Link>
            )}
            
            <div className="mobile-action-item" onClick={toggleTheme}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />} {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </div>
            
            <div className="mobile-action-item text-danger" onClick={handleLogout}>
              <LogOut size={20} /> Logout
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
