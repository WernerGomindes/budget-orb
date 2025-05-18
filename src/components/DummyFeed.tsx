import { useEffect } from 'react';
import { useBudgetStore } from '../store/budgetStore';

export function DummyFeed() {
  const updateFeature = useBudgetStore((state) => state.updateFeature);

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly select a feature and update its burned hours
      const featureId = Math.floor(Math.random() * 4) + 1;
      const randomIncrement = Math.random() * 4; // 0-4 hours increment
      
      // Get current burned hours
      const feature = useBudgetStore.getState().features.find(f => f.id === featureId);
      if (feature) {
        updateFeature(featureId, feature.burnedHrs + randomIncrement);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [updateFeature]);

  return null;
} 