export interface CommitInfo {
  id: string;
  message: string;
  author: string;
  date: string;
  timeSpent: number; // in hours
}

export interface WorkItem {
  id: number;
  type: 'Task' | 'Bug' | 'UserStory' | 'Feature';
  title: string;
  state: 'New' | 'Active' | 'Resolved' | 'Closed';
  assignedTo: string;
  plannedHours: number;
  burnedHours: number;
  commits: CommitInfo[];
}

export interface Feature {
  id: number;
  name: string;
  description: string;
  plannedHours: number;
  burnedHours: number;
  progress: number;
  status: 'OnTrack' | 'AtRisk' | 'Delayed';
  workItems: WorkItem[];
  startDate: string;
  endDate: string;
}

export interface ProjectMetrics {
  totalPlannedHours: number;
  totalBurnedHours: number;
  overallProgress: number;
  budgetStatus: 'Healthy' | 'Warning' | 'Critical';
  features: Feature[];
} 