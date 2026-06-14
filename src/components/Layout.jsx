import { useState, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import AIChat from './AIChat';
import { LearningContext } from '../context/LearningContext';

const Layout = () => {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <div className="main-content">
        <Navbar toggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />
        <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
          <Sidebar 
            onOpenAI={() => setIsAIChatOpen(true)} 
            isMobileOpen={isMobileSidebarOpen} 
            closeMobileSidebar={() => setIsMobileSidebarOpen(false)} 
          />
          <main className="page-container">
            <Outlet />
          </main>
        </div>
      </div>
      <AIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </div>
  );
};

export default Layout;
