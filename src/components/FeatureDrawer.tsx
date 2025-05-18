import { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import { scaleLinear, scaleTime } from 'd3-scale';
import { line } from 'd3-shape';
import { axisBottom, axisLeft } from 'd3-axis';
import { timeFormat } from 'd3-time-format';
import { useBudgetStore } from '../store/budgetStore';

interface FeatureDrawerProps {
  isOpen: boolean;
}

export function FeatureDrawer({ isOpen }: FeatureDrawerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const features = useBudgetStore((state) => state.features);
  const selectedFeatureId = useBudgetStore((state) => state.selectedFeatureId);

  const selectedFeature = features.find(f => f.id === selectedFeatureId);

  useEffect(() => {
    if (!svgRef.current || !selectedFeature || !isOpen) return;

    const svg = select(svgRef.current);
    const width = 400;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    // Clear previous content
    svg.selectAll('*').remove();

    // Sample data for burn-down chart
    const data = [
      { date: new Date(2025, 4, 1), planned: selectedFeature.plannedHrs, actual: 0 },
      { date: new Date(2025, 4, 7), planned: selectedFeature.plannedHrs * 0.75, actual: selectedFeature.burnedHrs * 0.3 },
      { date: new Date(2025, 4, 14), planned: selectedFeature.plannedHrs * 0.5, actual: selectedFeature.burnedHrs * 0.6 },
      { date: new Date(2025, 4, 21), planned: selectedFeature.plannedHrs * 0.25, actual: selectedFeature.burnedHrs * 0.8 },
      { date: new Date(), planned: 0, actual: selectedFeature.burnedHrs }
    ];

    // Scales
    const xScale = scaleTime()
      .domain([data[0].date, data[data.length - 1].date])
      .range([margin.left, width - margin.right]);

    const yScale = scaleLinear()
      .domain([0, selectedFeature.plannedHrs])
      .range([height - margin.bottom, margin.top]);

    // Lines
    const plannedLine = line<any>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.planned));

    const actualLine = line<any>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.actual));

    // Draw axes
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(axisBottom(xScale).tickFormat(timeFormat('%m/%d')));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(axisLeft(yScale));

    // Draw lines
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#22c55e')
      .attr('stroke-width', 2)
      .attr('d', plannedLine);

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 2)
      .attr('d', actualLine);

  }, [selectedFeature, isOpen]);

  if (!selectedFeature || !isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-gray-900 text-white p-6 shadow-xl transform transition-transform">
      <h2 className="text-2xl font-bold mb-4">{selectedFeature.name}</h2>
      <div className="mb-6">
        <p>Planned Hours: {selectedFeature.plannedHrs}</p>
        <p>Burned Hours: {selectedFeature.burnedHrs}</p>
        <p>Last Commit: {selectedFeature.lastCommit}</p>
      </div>
      <div className="mb-6">
        <h3 className="text-xl mb-2">Burn-down Chart</h3>
        <svg ref={svgRef} width="400" height="200" />
      </div>
      <a
        href="#"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        onClick={(e) => e.preventDefault()}
      >
        View in Azure DevOps
      </a>
    </div>
  );
} 