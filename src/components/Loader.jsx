import React from 'react';
import './Loader.css';

const Loader = ({ fullScreen = false, size = 'default' }) => {
  let containerClass = "loader-container";
  if (fullScreen) containerClass += " full-screen";
  else if (size === 'default') containerClass += " inline";
  else if (size === 'small') containerClass += " small";
  
  return (
    <div className={containerClass}>
      <div className={`google-loader ${size}`}>
        <div className="google-dot blue"></div>
        <div className="google-dot red"></div>
        <div className="google-dot yellow"></div>
        <div className="google-dot green"></div>
      </div>
    </div>
  );
};

export default Loader;
