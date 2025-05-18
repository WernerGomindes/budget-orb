import * as React from 'react';
import type { FC } from 'react';
import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { BudgetOrb } from './components/BudgetOrb';
import { FeatureDetails } from './components/FeatureDetails';
import { useProjectStore } from './store/projectStore';
import { theme } from './utils/theme';

const App: FC = () => {
  const { projectData } = useProjectStore();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDoubleClick = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-900">
      {/* 3D Canvas - with proper positioning */}
      <div 
        onDoubleClick={handleDoubleClick}
        className={`canvas-wrapper ${isFullscreen ? 'fullscreen' : ''}`}
      >
      <Canvas
          className={`canvas-container ${isFullscreen ? 'fullscreen' : ''}`}
          camera={{ position: [0, 15, 25], fov: 45 }}
          gl={{ 
            antialias: true,
            alpha: false,
            stencil: false,
            depth: true,
          }}
          dpr={[1, 2]}
        >
          <color attach="background" args={[theme.colors.bgPrimary]} />
          <fog attach="fog" args={[theme.colors.bgPrimary, 20, 40]} />
          
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.6} color="#60a5fa" />
          <pointLight position={[-10, -10, -10]} intensity={0.4} color="#818cf8" />
          
          {/* Environment */}
          <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
          
          {/* Controls */}
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={15}
            maxDistance={35}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
          
          {/* Main Content */}
          <Suspense fallback={null}>
            <BudgetOrb />
          </Suspense>
      </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {/* Header - with gradient background */}
        <div className="pointer-events-auto bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-transparent pt-6 pb-12 px-6">
          <h1 className="title text-4xl font-bold mb-6">Project Budget Overview</h1>
          
          {/* Stats Container */}
          <div className="stats-container">
            <div className="stats-item">
              <div className="stats-text">Budget Status</div>
              <div className="stats-value flex items-center gap-2">
                <span 
                  className="status-indicator"
                  style={{ 
                    backgroundColor: projectData.budgetStatus === 'Healthy' 
                      ? theme.colors.success 
                      : projectData.budgetStatus === 'Warning'
                      ? theme.colors.warning
                      : theme.colors.danger,
                    boxShadow: `0 0 10px ${
                      projectData.budgetStatus === 'Healthy' 
                        ? theme.colors.success 
                        : projectData.budgetStatus === 'Warning'
                        ? theme.colors.warning
                        : theme.colors.danger
                    }`
                  }}
                />
                {projectData.budgetStatus}
              </div>
            </div>

            <div className="stats-item">
              <div className="stats-text">Progress</div>
              <div className="stats-value">
                {Math.round(projectData.overallProgress)}%
              </div>
            </div>

            <div className="stats-item">
              <div className="stats-text">Hours</div>
              <div className="stats-value">
                {projectData.totalBurnedHours}/{projectData.totalPlannedHours}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="pointer-events-auto absolute bottom-6 left-6 bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
          <div className="legend-container">
            <h3 className="legend-title">Status Legend</h3>
            <div className="legend-item">
              <span 
                className="status-indicator" 
                style={{ 
                  backgroundColor: theme.colors.onTrack,
                  boxShadow: `0 0 10px ${theme.colors.onTrack}`
                }} 
              />
              <span className="legend-text">On Track</span>
            </div>
            <div className="legend-item">
              <span 
                className="status-indicator" 
                style={{ 
                  backgroundColor: theme.colors.atRisk,
                  boxShadow: `0 0 10px ${theme.colors.atRisk}`
                }} 
              />
              <span className="legend-text">At Risk</span>
            </div>
            <div className="legend-item">
              <span 
                className="status-indicator" 
                style={{ 
                  backgroundColor: theme.colors.delayed,
                  boxShadow: `0 0 10px ${theme.colors.delayed}`
                }} 
              />
              <span className="legend-text">Delayed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Details */}
      <FeatureDetails />
    </div>
  );
};

export default App; 