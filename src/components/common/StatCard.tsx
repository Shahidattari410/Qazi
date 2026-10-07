import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'emerald' | 'gold' | 'blue' | 'burgundy' | 'turquoise' | 'charcoal';
  trend?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'emerald',
  trend,
  onClick,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'gold':
        return {
          bg: 'bg-amber-50/80',
          border: 'border-amber-200/80',
          iconBg: 'bg-amber-500/10 text-amber-700',
          textColor: 'text-amber-950',
          accent: 'border-b-4 border-b-amber-500',
        };
      case 'blue':
        return {
          bg: 'bg-blue-50/70',
          border: 'border-blue-200/80',
          iconBg: 'bg-blue-600/10 text-blue-800',
          textColor: 'text-blue-950',
          accent: 'border-b-4 border-b-blue-600',
        };
      case 'burgundy':
        return {
          bg: 'bg-rose-50/70',
          border: 'border-rose-200/80',
          iconBg: 'bg-rose-600/10 text-rose-800',
          textColor: 'text-rose-950',
          accent: 'border-b-4 border-b-rose-700',
        };
      case 'turquoise':
        return {
          bg: 'bg-teal-50/70',
          border: 'border-teal-200/80',
          iconBg: 'bg-teal-600/10 text-teal-800',
          textColor: 'text-teal-950',
          accent: 'border-b-4 border-b-teal-600',
        };
      case 'charcoal':
        return {
          bg: 'bg-neutral-50',
          border: 'border-neutral-200',
          iconBg: 'bg-neutral-800/10 text-neutral-800',
          textColor: 'text-neutral-900',
          accent: 'border-b-4 border-b-neutral-700',
        };
      case 'emerald':
      default:
        return {
          bg: 'bg-emerald-50/80',
          border: 'border-emerald-200/80',
          iconBg: 'bg-emerald-700/10 text-emerald-800',
          textColor: 'text-emerald-950',
          accent: 'border-b-4 border-b-emerald-700',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${styles.bg} ${styles.border} ${styles.accent} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="font-urdu text-xs font-semibold text-neutral-600 tracking-wide">
            {title}
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <h3 className={`text-2xl font-bold font-mono tabular-nums ${styles.textColor}`}>
              {value}
            </h3>
            {trend && (
              <span className="text-[11px] font-medium text-emerald-700 font-mono">
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 font-urdu text-[11px] text-neutral-500 line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`p-2.5 rounded-lg shrink-0 shadow-inner ${styles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
