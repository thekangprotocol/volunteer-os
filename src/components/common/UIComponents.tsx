import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// --- BUTTON (Rounded, Minimal, Bold Typography) ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className,
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-bold tracking-tight rounded-full transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]";
  
  const variants = {
    primary: "bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 shadow-sm border border-transparent",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700",
    outline: "bg-transparent text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800/80",
    ghost: "bg-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60",
    danger: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20"
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5"
  };

  return (
    <button className={cn(baseStyle, variants[variant], sizes[size], className)} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

// --- BADGE ---
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'purple' | 'outline';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
  icon
}) => {
  const styles = {
    default: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    info: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    outline: "bg-transparent text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700"
  };

  return (
    <span className={cn("inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border tracking-wide", styles[variant], className)}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

// --- CARD (Soft Shadows, Thin Borders, 16px Radius) ---
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, hoverable = false, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "rounded-2xl p-6 bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md transition-all duration-300 shadow-sm",
        hoverable && "hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl hover:-translate-y-1 cursor-pointer active:scale-[0.99]",
        className
      )}
    >
      {children}
    </div>
  );
};

// --- STAT CARD ---
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, trend, trendPositive = true }) => {
  return (
    <Card className="flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{title}</span>
        {icon && <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">{icon}</div>}
      </div>
      <div className="mt-4">
        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">{value}</div>
        <div className="flex items-center gap-2 mt-1.5">
          {trend && (
            <span className={cn("text-xs font-mono font-bold px-2 py-0.5 rounded-full", trendPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
              {trend}
            </span>
          )}
          {subtitle && <span className="text-xs font-light text-zinc-500 dark:text-zinc-400">{subtitle}</span>}
        </div>
      </div>
    </Card>
  );
};

// --- AVATAR ---
interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className }) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg"
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return src ? (
    <img src={src} alt={name} className={cn("rounded-full object-cover border border-zinc-200 dark:border-zinc-700", sizes[size], className)} />
  ) : (
    <div className={cn("rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold flex items-center justify-center border border-zinc-200 dark:border-zinc-700", sizes[size], className)}>
      {initials}
    </div>
  );
};

// --- PROGRESS BAR ---
interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, className, color }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden", className)}>
      <div 
        className={cn("h-full transition-all duration-500 rounded-full", color || "bg-zinc-950 dark:bg-white")} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// --- EMPTY STATE ---
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
      <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-zinc-950 dark:text-white mb-1">{title}</h3>
      <p className="text-sm font-light text-zinc-500 dark:text-zinc-400 max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
};
