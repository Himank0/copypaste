import type { ChangeEvent } from 'react';
import { Button } from './Button';
import './QuickSearchBar.css';

export interface QuickSearchBarProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  actionLabel?: string;
  onAction?: () => void;
}

function noop(): void {
  // Default no-op for standalone previewability.
}

/**
 * Inline search bar: icon + label + text input + a trailing action button
 * (e.g. "Full Directory").
 *
 * @example
 * <QuickSearchBar label="Quick Search Active Dealer Records" actionLabel="Full Directory" />
 */
export function QuickSearchBar({
  label = 'Quick Search',
  placeholder = 'Search...',
  value = '',
  onChange = noop,
  actionLabel = 'Full Directory',
  onAction = noop,
}: QuickSearchBarProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="cmd-quick-search">
      <span className="cmd-quick-search__icon" aria-hidden="true">
        🔍
      </span>
      <span className="cmd-quick-search__label">{label}</span>
      <input
        type="text"
        className="cmd-quick-search__input"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        aria-label={label}
      />
      <Button variant="outline" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}

export default QuickSearchBar;
