import './BarChart.css';
import type { StatCardColor } from './StatCard';

export interface BarChartDatum {
  label: string;
  value: number;
  color?: StatCardColor;
}

export interface BarChartProps {
  data: BarChartDatum[];
}

const DEFAULT_DATA: BarChartDatum[] = [
  { label: 'Sample A', value: 40, color: 'blue' },
  { label: 'Sample B', value: 70, color: 'green' },
];

/**
 * Simple CSS-only vertical bar chart. Bar heights are scaled relative to the
 * largest value in the dataset. Colors align with {@link StatCardColor} so a
 * chart can visually match a row of StatCards.
 *
 * @example
 * <BarChart data={[{ label: 'On Hold', value: 885, color: 'red' }]} />
 */
export function BarChart({ data = DEFAULT_DATA }: BarChartProps) {
  const maxValue = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="cmd-bar-chart" role="img" aria-label="Bar chart">
      {data.map((datum) => {
        const heightPercent = Math.max(2, (datum.value / maxValue) * 100);
        const color = datum.color ?? 'blue';
        return (
          <div key={datum.label} className={`cmd-bar-chart__column cmd-bar-chart__column--${color}`}>
            <span className="cmd-bar-chart__value">{datum.value}</span>
            <span className="cmd-bar-chart__bar" style={{ height: `${heightPercent}%` }} />
            <span className="cmd-bar-chart__label">{datum.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default BarChart;
