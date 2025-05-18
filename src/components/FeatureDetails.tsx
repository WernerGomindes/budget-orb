import * as React from 'react';
import type { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore } from '../store/projectStore';
import { theme } from '../utils/theme';
import type { WorkItem } from '../types/project';

const WorkItemCard: FC<{ item: WorkItem }> = ({ item }) => {
  const getStatusColor = (state: string): string => {
    switch (state) {
      case 'Closed': return theme.colors.success;
      case 'Active': return theme.colors.warning;
      default: return theme.colors.textMuted;
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 mb-4 border border-slate-700/30">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{item.type}</span>
        <span 
          className="px-2 py-1 rounded text-xs font-medium"
          style={{ 
            backgroundColor: `${getStatusColor(item.state)}20`,
            color: getStatusColor(item.state),
            textShadow: `0 0 10px ${getStatusColor(item.state)}40`
          }}
        >
          {item.state}
        </span>
      </div>
      <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
      <div className="flex justify-between text-xs text-slate-400">
        <span>Assigned: {item.assignedTo}</span>
        <span>
          {item.burnedHours}/{item.plannedHours} hours
        </span>
      </div>
      
      {/* Commit History */}
      {item.commits.length > 0 && (
        <div className="mt-4 border-t border-slate-700 pt-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Commit History</h4>
          {item.commits.map(commit => (
            <div key={commit.id} className="text-sm mb-2 p-2 bg-slate-900 rounded">
              <div className="flex justify-between text-slate-400">
                <span>{commit.author}</span>
                <span>{new Date(commit.date).toLocaleDateString()}</span>
              </div>
              <p className="text-slate-300 mt-1">{commit.message}</p>
              <span className="text-xs text-slate-500">Time: {commit.timeSpent}h</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const FeatureDetails: FC = () => {
  const { selectedFeatureId, getFeatureById, setSelectedFeature } = useProjectStore();
  const feature = selectedFeatureId ? getFeatureById(selectedFeatureId) : null;

  if (!feature) return null;

  const getBurnRateStatus = () => {
    const ratio = feature.burnedHours / feature.plannedHours;
    if (ratio <= 0.8) return { color: theme.colors.success, text: 'Healthy' };
    if (ratio <= 1.0) return { color: theme.colors.warning, text: 'At Risk' };
    return { color: theme.colors.danger, text: 'Over Budget' };
  };

  const status = getBurnRateStatus();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="feature-details fixed bottom-0 right-0 w-96 max-h-[80vh] rounded-tl-2xl p-6 overflow-y-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <h2 className="title text-xl font-bold mb-2">{feature.name}</h2>
          <p className="text-sm text-slate-400">{feature.description}</p>
        </div>

        {/* Status and Progress */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Budget Status</div>
            <div className="flex items-center">
              <div
                className="w-2 h-2 rounded-full mr-2"
                style={{ 
                  backgroundColor: status.color,
                  boxShadow: `0 0 10px ${status.color}`
                }}
              />
              <span className="text-sm text-white font-medium">{status.text}</span>
            </div>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Progress</div>
            <div className="text-sm text-white font-medium">
              {Math.round(feature.progress)}%
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Timeline</h3>
          <div className="flex justify-between text-xs text-slate-400">
            <span>Start: {new Date(feature.startDate).toLocaleDateString()}</span>
            <span>End: {new Date(feature.endDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Work Items */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Work Items</h3>
          {feature.workItems.map(item => (
            <WorkItemCard key={item.id} item={item} />
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={() => setSelectedFeature(null)}
          className="close-button"
          aria-label="Close details"
        >
          ✕
        </button>
      </motion.div>
    </AnimatePresence>
  );
}; 