import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'blue',
  onClick
}) {
  const colorMap = {
    blue: {
      bg: 'bg-medblue-50 text-medblue-600',
      border: 'border-slate-200/80 hover:border-medblue-300',
      accent: 'text-medblue-600'
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600',
      border: 'border-slate-200/80 hover:border-emerald-300',
      accent: 'text-emerald-600'
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600',
      border: 'border-slate-200/80 hover:border-amber-300',
      accent: 'text-amber-600'
    },
    rose: {
      bg: 'bg-rose-50 text-rose-600',
      border: 'border-slate-200/80 hover:border-rose-300',
      accent: 'text-rose-600'
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600',
      border: 'border-slate-200/80 hover:border-purple-300',
      accent: 'text-purple-600'
    }
  };

  const currentTheme = colorMap[colorScheme] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border shadow-sm transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md' : ''
      } ${currentTheme.border}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${currentTheme.bg}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
          {trend && (
            <span className={`font-semibold ${trend.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
