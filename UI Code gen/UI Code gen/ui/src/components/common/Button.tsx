import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

export type ButtonVariant = 'filled' | 'outline' | 'ghost';
export type ButtonSize = 'md' | 'sm';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Optional trailing count badge, e.g. "My Tasks (6)". */
  badge?: number | string;
  type?: 'button' | 'submit' | 'reset';
  children?: ReactNode;
}

/**
 * Pill-shaped action button supporting filled/outline/ghost variants and an
 * optional trailing badge (e.g. task counts).
 *
 * @example
 * <Button variant="filled">+ Create New Dealer</Button>
 * <Button variant="outline" badge={6}>My Tasks</Button>
 */
export function Button({
  variant = 'filled',
  size = 'md',
  badge,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    'cmd-button',
    `cmd-button--${variant}`,
    size === 'sm' ? 'cmd-button--sm' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} {...rest}>
      {children}
      {badge !== undefined && <span className="cmd-button__badge">{badge}</span>}
    </button>
  );
}

export default Button;
