import './StatCard.css';

export type StatCardColor = 'red' | 'blue' | 'green' | 'teal' | 'purple' | 'orange';

export interface StatCardProps {
  value: number | string;
  label: string;
  color?: StatCardColor;
}

/**
 * KPI tile with a colored top accent bar, a large value, and a label.
 * Used in grids summarizing lifecycle/stage counts.
 *
 * @example
 * <StatCard value={885} label="On Hold" color="red" />
 */
export function StatCard({ value, label, color = 'blue' }: StatCardProps) {
  return (
    <div className={`cmd-stat-card cmd-stat-card--${color}`}>
      <span className="cmd-stat-card__value">{value}</span>
      <span className="cmd-stat-card__label">{label}</span>
      <span className="cmd-stat-card__bar" aria-hidden="true" />
    </div>
  );
}

export default StatCard;
