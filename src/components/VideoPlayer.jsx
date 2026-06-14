import ReactPlayer from 'react-player';
import { Play, SkipBack, SkipForward, Maximize, Settings, CheckCircle } from 'lucide-react';
import './VideoPlayer.css';

const VideoPlayer = ({ url, title, onEnded, onNext, onPrev, isCompleted, onMarkCompleted }) => {
  let finalUrl = url;
  if (url && url.includes('cloudinary.com') && !url.match(/\.(mp4|webm|ogg)$/i)) {
    finalUrl = `${url}.mp4`;
  }

  const isNativeVideo = finalUrl?.match(/\.(mp4|webm|ogg)$/i) || finalUrl?.includes('cloudinary.com');

  return (
    <div className="video-player-wrapper card google-border-hover">
      <div className="player-container">
        {isNativeVideo ? (
          <video 
            src={finalUrl} 
            className="react-player" 
            controls 
            onEnded={onEnded}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : (
          <ReactPlayer
            url={finalUrl}
            width="100%"
            height="100%"
            controls={true}
            playing={false}
            onEnded={onEnded}
            className="react-player"
          />
        )}
      </div>
      <div className="player-controls">
        <div className="player-title">
          <h4>{title}</h4>
        </div>
        <div className="player-actions">
          {isCompleted ? (
            <button className="btn-advanced-success" disabled>
              <CheckCircle size={18} className="text-white" /> Completed
            </button>
          ) : (
            <button className="btn-advanced-complete" onClick={onMarkCompleted}>
              <CheckCircle size={18} /> Mark as Completed
            </button>
          )}
          <button className="icon-btn ml-2" onClick={onPrev} title="Previous Video"><SkipBack size={20}/></button>
          <button className="icon-btn" onClick={onNext} title="Next Video"><SkipForward size={20}/></button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
