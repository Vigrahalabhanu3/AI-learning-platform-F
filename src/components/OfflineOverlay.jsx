import { useState, useEffect } from 'react';
import './OfflineOverlay.css';
import { WifiOff } from 'lucide-react';

const OfflineOverlay = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="offline-overlay">
      <div className="offline-modal glass-panel">
        <div className="offline-icon-container">
          <WifiOff size={48} className="offline-icon" />
        </div>
        <h2>No Internet Connection</h2>
        <p>Please check your network settings and try again.</p>
        <button className="btn-primary retry-btn" onClick={() => window.location.reload()}>
          Retry Connection
        </button>
      </div>
    </div>
  );
};

export default OfflineOverlay;
