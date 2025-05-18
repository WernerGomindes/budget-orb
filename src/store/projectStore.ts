import create from 'zustand';
import { ProjectMetrics, Feature } from '../types/project';

const sampleData: ProjectMetrics = {
  totalPlannedHours: 1200,
  totalBurnedHours: 850,
  overallProgress: 70.8,
  budgetStatus: 'Warning',
  features: [
    {
      id: 1,
      name: 'User Authentication System',
      description: 'Implement OAuth2 and role-based access control',
      plannedHours: 160,
      burnedHours: 140,
      progress: 87.5,
      status: 'OnTrack',
      startDate: '2024-02-01',
      endDate: '2024-02-15',
      workItems: [
        {
          id: 101,
          type: 'UserStory',
          title: 'Implement OAuth2 Flow',
          state: 'Closed',
          assignedTo: 'John Doe',
          plannedHours: 40,
          burnedHours: 35,
          commits: [
            {
              id: 'abc123',
              message: 'Add OAuth2 client implementation',
              author: 'John Doe',
              date: '2024-02-05',
              timeSpent: 8
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Data Analytics Dashboard',
      description: 'Real-time analytics dashboard with charts',
      plannedHours: 320,
      burnedHours: 380,
      progress: 95,
      status: 'Delayed',
      startDate: '2024-02-16',
      endDate: '2024-03-15',
      workItems: [
        {
          id: 201,
          type: 'Feature',
          title: 'Chart Components',
          state: 'Active',
          assignedTo: 'Jane Smith',
          plannedHours: 80,
          burnedHours: 95,
          commits: [
            {
              id: 'def456',
              message: 'Implement real-time chart updates',
              author: 'Jane Smith',
              date: '2024-02-20',
              timeSpent: 10
            }
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'API Integration Layer',
      description: 'RESTful API integration with microservices',
      plannedHours: 240,
      burnedHours: 180,
      progress: 75,
      status: 'OnTrack',
      startDate: '2024-03-01',
      endDate: '2024-03-30',
      workItems: [
        {
          id: 301,
          type: 'Task',
          title: 'API Gateway Setup',
          state: 'Active',
          assignedTo: 'Mike Johnson',
          plannedHours: 60,
          burnedHours: 45,
          commits: [
            {
              id: 'ghi789',
              message: 'Configure API gateway routes',
              author: 'Mike Johnson',
              date: '2024-03-05',
              timeSpent: 6
            }
          ]
        }
      ]
    },
    {
      id: 4,
      name: 'Performance Optimization',
      description: 'System-wide performance improvements',
      plannedHours: 480,
      burnedHours: 150,
      progress: 31.25,
      status: 'AtRisk',
      startDate: '2024-03-15',
      endDate: '2024-04-30',
      workItems: [
        {
          id: 401,
          type: 'Bug',
          title: 'Memory Leak Fix',
          state: 'Active',
          assignedTo: 'Sarah Wilson',
          plannedHours: 120,
          burnedHours: 40,
          commits: [
            {
              id: 'jkl012',
              message: 'Fix memory leak in data processing',
              author: 'Sarah Wilson',
              date: '2024-03-20',
              timeSpent: 8
            }
          ]
        }
      ]
    }
  ]
};

interface ProjectStore {
  projectData: ProjectMetrics;
  selectedFeatureId: number | null;
  setSelectedFeature: (id: number | null) => void;
  getFeatureById: (id: number) => Feature | undefined;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projectData: sampleData,
  selectedFeatureId: null,
  setSelectedFeature: (id) => set({ selectedFeatureId: id }),
  getFeatureById: (id) => get().projectData.features.find(f => f.id === id)
})); 