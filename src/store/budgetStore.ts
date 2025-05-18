import { create } from 'zustand';
import seedData from '../data/seed.json';

export interface Feature {
  id: number;
  name: string;
  plannedHrs: number;
  burnedHrs: number;
  lastCommit: string;
}

interface BudgetState {
  project: string;
  ratePerHour: number;
  features: Feature[];
  selectedFeatureId: number | null;
  timestamp: string;
  updateFeature: (featureId: number, burnedHrs: number) => void;
  setSelectedFeature: (featureId: number | null) => void;
}

export const useBudgetStore = create<BudgetState>((set) => ({
  ...seedData,
  selectedFeatureId: null,
  updateFeature: (featureId, burnedHrs) =>
    set((state) => ({
      features: state.features.map((feature) =>
        feature.id === featureId ? { ...feature, burnedHrs } : feature
      ),
      timestamp: new Date().toISOString(),
    })),
  setSelectedFeature: (featureId) =>
    set({ selectedFeatureId: featureId }),
})); 