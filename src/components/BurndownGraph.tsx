import * as React from 'react';
import type { FC } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface BurndownData {
  date: string;
  plannedBudget: number;
  actualBudget: number;
  idealBurndown: number;
}

interface ProjectData {
  totalBudget: number;
  startDate: string;
  endDate: string;
  actualSpent: number[];
  plannedSpent: number[];
}

interface BurndownGraphProps {
  isOpen: boolean;
  onClose: () => void;
  projectData: ProjectData;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip: FC<TooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/90 backdrop-blur-sm p-3 rounded-lg border border-blue-500/50 shadow-xl">
        <p className="font-orbitron text-blue-300 mb-1 text-sm">{label}</p>
        {payload.map((entry, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-300 text-sm">{entry.name}:</span>
            <span className="text-white font-semibold text-sm">
              ${entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const generateBurndownData = (projectData: ProjectData): BurndownData[] => {
  const startDate = new Date(projectData.startDate);
  const endDate = new Date(projectData.endDate);
  const currentDate = new Date();
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.min(
    Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
    Math.floor(totalDays * 0.65) // Show project at 65% completion
  );
  
  // Create some realistic variance patterns
  const createVariance = (day: number, totalDays: number) => {
    const progress = day / totalDays;
    // Add some random variance
    const variance = Math.sin(progress * Math.PI * 4) * 5000 + 
                    (Math.random() - 0.5) * 3000;
    return variance;
  };

  // Generate daily data points up to current date
  return Array.from({ length: daysElapsed }, (_, index) => {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + index);
    
    // Ideal burndown (linear)
    const idealBurndown = projectData.totalBudget * (1 - index / totalDays);
    
    // Planned spending (slightly curved)
    const plannedProgress = Math.pow(1 - index / totalDays, 0.9);
    const plannedBudget = projectData.totalBudget * plannedProgress;
    
    // Actual spending (more irregular with variance)
    const actualProgress = Math.pow(1 - index / totalDays, 1.1);
    const baseActual = projectData.totalBudget * actualProgress;
    const variance = createVariance(index, totalDays);
    const actualBudget = Math.max(0, baseActual + variance);
    
    return {
      date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      plannedBudget: Math.round(plannedBudget),
      actualBudget: Math.round(actualBudget),
      idealBurndown: Math.round(idealBurndown)
    };
  });
};

export const BurndownGraph: React.FC<BurndownGraphProps> = ({ isOpen, onClose, projectData }) => {
  const data = generateBurndownData(projectData);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-screen bg-slate-900/95 backdrop-blur-md border-l border-blue-500/30 shadow-2xl z-50 transition-all duration-300 ease-out"
         style={{ 
           width: '32rem',
           transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
           animation: 'slideInRight 0.3s ease-out'
         }}>
      <div className="h-full p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-orbitron bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Budget Burndown
            </h2>
            <div className="text-sm text-blue-300/70">
              Total Budget: ${projectData.totalBudget.toLocaleString()}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-800/50 text-gray-400 hover:text-white hover:bg-blue-500/30 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label="Close burndown graph"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A4A6D" opacity={0.3} />
              <XAxis
                dataKey="date"
                stroke="#A1C6D4"
                tick={{ fill: '#A1C6D4', fontSize: 10 }}
                tickLine={{ stroke: '#A1C6D4' }}
              />
              <YAxis
                stroke="#A1C6D4"
                tick={{ fill: '#A1C6D4', fontSize: 10 }}
                tickLine={{ stroke: '#A1C6D4' }}
                tickFormatter={(value: number) => `$${(value / 1000)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{
                  fontSize: '10px',
                  paddingTop: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="idealBurndown"
                stroke="#4B8B9D"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Ideal"
              />
              <Line
                type="monotone"
                dataKey="plannedBudget"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff' }}
                name="Planned"
              />
              <Line
                type="monotone"
                dataKey="actualBudget"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: '#F59E0B', strokeWidth: 2, fill: '#fff' }}
                name="Actual"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="feature-details-card flex flex-col justify-center">
            <div className="feature-details-label">Remaining</div>
            <div className="feature-details-value text-green-400">
              ${(data[data.length - 1]?.actualBudget || 0).toLocaleString()}
            </div>
          </div>
          <div className="feature-details-card flex flex-col justify-center">
            <div className="feature-details-label">Spent</div>
            <div className="feature-details-value text-blue-400">
              ${(projectData.totalBudget - (data[data.length - 1]?.actualBudget || 0)).toLocaleString()}
            </div>
          </div>
          <div className="feature-details-card flex flex-col justify-center">
            <div className="feature-details-label">Progress</div>
            <div className="feature-details-value text-cyan-400">
              {Math.round((data.length / Math.ceil((new Date(projectData.endDate).getTime() - new Date(projectData.startDate).getTime()) / (1000 * 60 * 60 * 24))) * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};