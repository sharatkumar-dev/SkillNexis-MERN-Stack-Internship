import React from 'react';
import { HardDrive, Images, Layers, Sparkles } from 'lucide-react';

const StorageStats = ({ stats }) => {
  const totalImages = stats?.totalImages || 0;
  const formattedTotalSize = stats?.formattedTotalSize || '0 B';
  const categoriesCount = stats?.categories?.length || 0;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
          <Images size={24} />
        </div>
        <div>
          <div className="stat-value">{totalImages}</div>
          <div className="stat-label">Total Images Stored</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}>
          <HardDrive size={24} />
        </div>
        <div>
          <div className="stat-value">{formattedTotalSize}</div>
          <div className="stat-label">Disk Storage Consumed</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>
          <Layers size={24} />
        </div>
        <div>
          <div className="stat-value">{categoriesCount}</div>
          <div className="stat-label">Active Categories</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
          <Sparkles size={24} />
        </div>
        <div>
          <div className="stat-value">5 MB</div>
          <div className="stat-label">Max Allowed per File</div>
        </div>
      </div>
    </div>
  );
};

export default StorageStats;
