import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-navy-900 text-white hover:bg-navy-800 active:bg-navy-700 focus:ring-navy-900 shadow-sm border border-navy-900',
    secondary: 'bg-white text-navy-900 border border-border hover:bg-ivory hover:border-ink-secondary/30 active:bg-gray-100 focus:ring-navy-800 shadow-sm',
    accent: 'bg-gold text-navy-900 hover:bg-gold-light active:bg-gold-dark font-semibold focus:ring-gold shadow-sm border border-gold',
    forest: 'bg-forest-700 text-white hover:bg-forest-600 active:bg-forest-800 focus:ring-forest-700 shadow-sm border border-forest-700',
    danger: 'bg-status-error text-white hover:bg-red-700 active:bg-red-800 focus:ring-status-error shadow-sm',
    ghost: 'text-ink-secondary hover:text-navy-900 hover:bg-black/5 active:bg-black/10 focus:ring-navy-800',
    link: 'text-forest-700 hover:text-forest-800 underline-offset-4 hover:underline p-0 h-auto focus:ring-forest-700',
  };

  const sizes = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        Icon && <Icon className="w-4 h-4 text-current" />
      )}
      {children}
    </button>
  );
}
