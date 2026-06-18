import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-teal-700 text-white shadow-[0_16px_32px_rgba(15,72,86,0.2)] hover:-translate-y-0.5 hover:bg-teal-800',
        destructive: 'bg-rose-500 text-white shadow-[0_16px_32px_rgba(244,63,94,0.18)] hover:-translate-y-0.5 hover:bg-rose-600',
        outline: 'border border-slate-200/90 bg-white/92 text-slate-800 hover:-translate-y-0.5 hover:bg-white',
        secondary: 'bg-teal-100 text-teal-900 shadow-[0_12px_24px_rgba(15,72,86,0.12)] hover:-translate-y-0.5 hover:bg-teal-200',
        ghost: 'text-slate-700 hover:bg-white/70 hover:text-slate-900',
        link: 'text-teal-900 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-4 py-2',
        sm: 'h-9 rounded-lg px-3',
        lg: 'h-12 rounded-xl px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
