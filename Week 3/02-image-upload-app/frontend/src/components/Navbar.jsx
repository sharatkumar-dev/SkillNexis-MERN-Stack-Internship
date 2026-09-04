import React from 'react';
import { Image as ImageIcon, UploadCloud, RefreshCw } from 'lucide-react';

const Navbar = ({ onRefresh, isRefreshing, onScrollToUpload }) => {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a href="#home" className="brand-wrapper">
          <div className="brand-icon-box">
            <ImageIcon size={24} />
          </div>
          <span className="brand-text">
            PixelVault
            <span className="brand-badge">Multer + MERN</span>
          </span>
        </a>

        <div className="navbar-actions">
          <button
            className="btn btn-secondary btn-icon"
            onClick={onRefresh}
            title="Refresh Gallery"
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
          </button>

          <button className="btn btn-primary" onClick={onScrollToUpload}>
            <UploadCloud size={18} />
            <span>Upload Image</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
