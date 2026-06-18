import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const cardVariants = cva('overflow-hidden rounded-[28px] border border-white/70 bg-white/88 shadow-[0_24px_64px_rgba(31,42,46,0.08)] backdrop-blur-md', {
  variants: {
    variant: {
      default: '',
      glass: 'bg-white/74',
      warm: 'bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,243,230,0.94))]',
      soft: 'bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(237,247,246,0.94))]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export function Card({ className, variant, ...props }: CardProps) {
  return <div className={cn('flex flex-col', cardVariants({ variant }), className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col p-6 sm:p-7', className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-2 p-6 sm:p-7', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-xl font-semibold tracking-tight text-slate-900', className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm leading-7 text-slate-500', className)} {...props} />;
}
