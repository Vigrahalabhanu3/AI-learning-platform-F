import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import TopicPage from './pages/TopicPage';
import AdminDashboard from './pages/AdminDashboard';
import MyLibrary from './pages/MyLibrary';
import MyCertificates from './pages/MyCertificates';
import AdminCertificateManager from './pages/AdminCertificateManager';
import CertificateVerificationPage from './pages/CertificateVerificationPage';
import ResumeDashboard from './pages/ResumeDashboard';
import ResumeEditor from './pages/ResumeEditor';
import Explore from './pages/Explore';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/profile/ProfilePage';
import PlacementDashboard from './pages/placement/PlacementDashboard';
import Confetti from 'react-confetti';
import { LearningContext } from './context/LearningContext';
import TopicPracticePage from './pages/placement/TopicPracticePage';
import MockTestSection from './pages/placement/MockTestSection';
import CompanyPreparation from './pages/placement/CompanyPreparation';
import InterviewPreparation from './pages/placement/InterviewPreparation';
import AIAssistantDashboard from './pages/ai/AIAssistantDashboard';
import AIKnowledgeBase from './pages/admin/AIKnowledgeBase';
import AdminRoadmapEditor from './pages/AdminRoadmapEditor';
import RoadmapView from './pages/RoadmapView';
import RoadmapsList from './pages/RoadmapsList';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import OfflineOverlay from './components/OfflineOverlay';
import NotFound from './pages/NotFound';

function App() {
  const { showConfetti } = useContext(LearningContext);

  return (
    <div style={{ position: 'relative' }}>
      {showConfetti && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, pointerEvents: 'none' }}>
          <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={500} />
        </div>
      )}
      <AuthProvider>
        <OfflineOverlay />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify/:id" element={<CertificateVerificationPage />} />
          
          {/* Public Layout Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="explore" element={<Explore />} />
            <Route path="roadmaps" element={<RoadmapsList />} />
            
            {/* Protected Layout Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="topic/:id" element={<TopicPage />} />
              <Route path="library" element={<MyLibrary />} />
              <Route path="certificates" element={<MyCertificates />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="resumes" element={<ResumeDashboard />} />
              <Route path="resumes/edit/:id" element={<ResumeEditor />} />
              <Route path="placement/*" element={<PlacementDashboard />} />
              <Route path="/placement/mock-tests" element={<MockTestSection />} />
              <Route path="/placement/companies" element={<CompanyPreparation />} />
              <Route path="/placement/interview" element={<InterviewPreparation />} />
              
              {/* AI Assistant */}
              <Route path="/ai" element={<AIAssistantDashboard />} />
              
              <Route element={<ProtectedRoute requireAdmin={true} />}>
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/certificates" element={<AdminCertificateManager />} />
                <Route path="/admin/ai-knowledge" element={<AIKnowledgeBase />} />
              </Route>
            </Route>

            {/* Standalone full-screen roadmap routes */}
            <Route path="/roadmap/:slug" element={<RoadmapView />} />
            <Route element={<ProtectedRoute requireAdmin={true} />}>
              <Route path="/admin/roadmap/:id" element={<AdminRoadmapEditor />} />
            </Route>
          </Route>
          
          {/* Catch-all route outside Layout to handle global 404s cleanly */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
    </div>
  );
}

export default App;
