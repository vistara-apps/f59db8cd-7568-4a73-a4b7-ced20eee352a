'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated';
}

export function Card({ children, className, variant = 'default' }: CardProps) {
  const baseClasses = 'bg-surface rounded-lg border border-gray-100 p-6';
  
  const variants = {
    default: 'shadow-card',
    elevated: 'shadow-card hover:shadow-lg transition-shadow duration-200',
  };

  return (
    <div className={cn(baseClasses, variants[variant], className)}>
      {children}
    </div>
  );
}
